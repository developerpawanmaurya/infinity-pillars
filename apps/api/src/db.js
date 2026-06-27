import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await pool.query(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    phone TEXT,
    selected_services TEXT NOT NULL,
    additional_info TEXT,
    booked_date_time TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`);

export default pool;
