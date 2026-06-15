CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habits (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habit_logs (
  id SERIAL PRIMARY KEY,
  habit_id INT REFERENCES habits(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  UNIQUE (habit_id, completed_date)
);
