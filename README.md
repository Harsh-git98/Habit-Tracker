# Habit Tracker API

A minimal Habit Tracker backend using Express + PostgreSQL.

## Features

- Create users
- Create habits (`daily` or `weekly`)
- Mark habits complete by date
- Fetch habits with completion status + streak
- Fetch streak for a single habit
- Server-rendered web app using EJS (minimal black theme)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your env file from example:

   ```bash
   copy .env.example .env
   ```

3. Create a PostgreSQL database named `habits` (or update `.env`).

4. Apply schema:

   ```bash
   psql -U postgres -d habits -f db/schema.sql
   ```

5. Start server:

   ```bash
   npm run dev
   ```

Server default URL: `http://localhost:3000`

## Web App

Open `http://localhost:3000` in browser.

From the UI you can:

- Create users
- Select active user and date
- Create habits (daily/weekly)
- Mark habits done for selected date
- See current streak and completion state

## API

### Create user

`POST /users`

```json
{
  "email": "user@example.com"
}
```

### Create habit

`POST /habits`

```json
{
  "user_id": 1,
  "title": "Workout daily",
  "frequency": "daily"
}
```

### Mark habit complete

`POST /habits/:id/complete`

```json
{
  "completed_date": "2026-05-02"
}
```

- If `completed_date` is omitted, server uses `CURRENT_DATE`.

### Get habits for user with status + streak

`GET /habits?user_id=1&date=2026-05-02`

- `date` is optional and defaults to today.

### Get streak for single habit

`GET /habits/:id/streak?date=2026-05-02`

- `date` is optional and defaults to today.

## Notes on streaks

- Daily streak: counts consecutive completed days from the anchor date backward.
- Weekly streak: counts consecutive weeks (Mon-Sun) with at least one completion.
