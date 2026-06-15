const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.DATABASE_URL || process.env.YOUR_SUPABASE_DB_URL;

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.PGUSER || 'postgres',
      host: process.env.PGHOST || 'localhost',
      database: process.env.PGDATABASE || 'habits',
      password: process.env.PGPASSWORD || 'password',
      port: Number(process.env.PGPORT) || 5432,
    });

async function initializeDatabase() {
  const schemaPath = path.resolve(__dirname, '..', 'db', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(schemaSql);
}

module.exports = { pool, initializeDatabase };