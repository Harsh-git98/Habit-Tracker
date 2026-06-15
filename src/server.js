require('dotenv').config();

const express = require('express');
const { pool, initializeDatabase } = require('./db');
const { calculateCurrentStreak } = require('./streak');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'views');

function parseDateOrNull(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function getDateFromQuery(queryDate) {
  return parseDateOrNull(queryDate) || new Date().toISOString().slice(0, 10);
}

async function fetchHabitsWithStatus(userId, date) {
  const habitsResult = await pool.query(
    `SELECT
       h.id,
       h.title,
       h.frequency,
       h.created_at,
       EXISTS (
         SELECT 1
         FROM habit_logs hl
         WHERE hl.habit_id = h.id AND hl.completed_date = $2::date
       ) AS completed_for_date
     FROM habits h
     WHERE h.user_id = $1
     ORDER BY h.created_at DESC`,
    [userId, date]
  );

  const habits = habitsResult.rows;
  if (habits.length === 0) {
    return [];
  }

  const habitIds = habits.map((habit) => habit.id);
  const logsResult = await pool.query(
    `SELECT habit_id, completed_date
     FROM habit_logs
     WHERE habit_id = ANY($1::int[]) AND completed_date <= $2::date
     ORDER BY completed_date DESC`,
    [habitIds, date]
  );

  const logsByHabitId = logsResult.rows.reduce((acc, row) => {
    if (!acc[row.habit_id]) {
      acc[row.habit_id] = [];
    }
    acc[row.habit_id].push(row.completed_date);
    return acc;
  }, {});

  return habits.map((habit) => {
    const completedDates = logsByHabitId[habit.id] || [];
    const streak = calculateCurrentStreak({
      completedDates,
      frequency: habit.frequency,
      anchorDate: date,
    });

    return {
      ...habit,
      streak,
    };
  });
}

app.get('/', async (req, res, next) => {
  try {
    const date = getDateFromQuery(req.query.date);
    const usersResult = await pool.query(
      'SELECT id, email, created_at FROM users ORDER BY created_at DESC'
    );

    const users = usersResult.rows;
    const requestedUserId = Number(req.query.user_id);
    const selectedUserId = Number.isNaN(requestedUserId)
      ? (users[0] ? users[0].id : null)
      : requestedUserId;

    let habits = [];
    if (selectedUserId) {
      habits = await fetchHabitsWithStatus(selectedUserId, date);
    }

    return res.render('index', {
      users,
      habits,
      date,
      selectedUserId,
      notice: req.query.notice || null,
      error: req.query.error || null,
    });
  } catch (error) {
    return next(error);
  }
});

app.post('/web/users', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.redirect('/?error=Email%20is%20required');
    }

    const result = await pool.query(
      'INSERT INTO users (email) VALUES ($1) RETURNING id',
      [email.trim().toLowerCase()]
    );

    return res.redirect(`/?user_id=${result.rows[0].id}&notice=User%20created`);
  } catch (error) {
    if (error.code === '23505') {
      return res.redirect('/?error=Email%20already%20exists');
    }
    return next(error);
  }
});

app.post('/web/habits', async (req, res, next) => {
  try {
    const userId = Number(req.body.user_id);
    const title = req.body.title;
    const frequency = req.body.frequency || 'daily';
    const date = getDateFromQuery(req.body.date);

    if (Number.isNaN(userId) || !title) {
      return res.redirect(`/?date=${date}&error=User%20and%20title%20are%20required`);
    }

    if (!['daily', 'weekly'].includes(frequency)) {
      return res.redirect(`/?user_id=${userId}&date=${date}&error=Invalid%20frequency`);
    }

    await pool.query(
      'INSERT INTO habits (user_id, title, frequency) VALUES ($1, $2, $3)',
      [userId, title, frequency]
    );

    return res.redirect(`/?user_id=${userId}&date=${date}&notice=Habit%20created`);
  } catch (error) {
    return next(error);
  }
});

app.post('/web/habits/:id/complete', async (req, res, next) => {
  try {
    const habitId = Number(req.params.id);
    const userId = Number(req.body.user_id);
    const date = getDateFromQuery(req.body.date);
    const completedDate = parseDateOrNull(req.body.completed_date) || date;

    if (Number.isNaN(habitId) || Number.isNaN(userId)) {
      return res.redirect('/?error=Invalid%20request');
    }

    await pool.query(
      `INSERT INTO habit_logs (habit_id, completed_date)
       VALUES ($1, $2::date)
       ON CONFLICT (habit_id, completed_date)
       DO UPDATE SET completed_date = EXCLUDED.completed_date`,
      [habitId, completedDate]
    );

    return res.redirect(`/?user_id=${userId}&date=${date}&notice=Marked%20done`);
  } catch (error) {
    return next(error);
  }
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/users', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'email is required' });
    }

    const result = await pool.query(
      'INSERT INTO users (email) VALUES ($1) RETURNING *',
      [email.trim().toLowerCase()]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'email already exists' });
    }

    return next(error);
  }
});

app.post('/habits', async (req, res, next) => {
  try {
    const { user_id: userId, title, frequency = 'daily' } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ error: 'user_id and title are required' });
    }

    if (!['daily', 'weekly'].includes(frequency)) {
      return res.status(400).json({ error: "frequency must be 'daily' or 'weekly'" });
    }

    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rowCount === 0) {
      return res.status(404).json({ error: 'user not found' });
    }

    const result = await pool.query(
      'INSERT INTO habits (user_id, title, frequency) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, frequency]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

app.post('/habits/:id/complete', async (req, res, next) => {
  try {
    const habitId = Number(req.params.id);
    const completedDate = parseDateOrNull(req.body.completed_date);

    if (Number.isNaN(habitId)) {
      return res.status(400).json({ error: 'invalid habit id' });
    }

    if (req.body.completed_date && !completedDate) {
      return res.status(400).json({ error: 'completed_date must be a valid date' });
    }

    const habitCheck = await pool.query('SELECT id FROM habits WHERE id = $1', [habitId]);
    if (habitCheck.rowCount === 0) {
      return res.status(404).json({ error: 'habit not found' });
    }

    const result = await pool.query(
      `INSERT INTO habit_logs (habit_id, completed_date)
       VALUES ($1, COALESCE($2::date, CURRENT_DATE))
       ON CONFLICT (habit_id, completed_date)
       DO UPDATE SET completed_date = EXCLUDED.completed_date
       RETURNING *`,
      [habitId, completedDate]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

app.get('/habits', async (req, res, next) => {
  try {
    const userId = Number(req.query.user_id);
    const date = getDateFromQuery(req.query.date);

    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: 'valid user_id query is required' });
    }

    const enrichedHabits = await fetchHabitsWithStatus(userId, date);

    return res.json(enrichedHabits);
  } catch (error) {
    return next(error);
  }
});

app.get('/habits/:id/streak', async (req, res, next) => {
  try {
    const habitId = Number(req.params.id);
    const date = parseDateOrNull(req.query.date) || new Date().toISOString().slice(0, 10);

    if (Number.isNaN(habitId)) {
      return res.status(400).json({ error: 'invalid habit id' });
    }

    const habitResult = await pool.query('SELECT id, title, frequency FROM habits WHERE id = $1', [habitId]);
    if (habitResult.rowCount === 0) {
      return res.status(404).json({ error: 'habit not found' });
    }

    const logsResult = await pool.query(
      `SELECT completed_date
       FROM habit_logs
       WHERE habit_id = $1 AND completed_date <= $2::date
       ORDER BY completed_date DESC`,
      [habitId, date]
    );

    const streak = calculateCurrentStreak({
      completedDates: logsResult.rows.map((row) => row.completed_date),
      frequency: habitResult.rows[0].frequency,
      anchorDate: date,
    });

    return res.json({
      habit_id: habitId,
      title: habitResult.rows[0].title,
      frequency: habitResult.rows[0].frequency,
      date,
      streak,
    });
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'internal server error' });
});

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    process.exit(1);
  }
}

startServer();
