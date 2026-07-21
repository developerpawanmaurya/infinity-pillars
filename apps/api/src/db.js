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

await pool.query(`
  CREATE TABLE IF NOT EXISTS job_applications (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role_title TEXT NOT NULL,
    department TEXT,
    portfolio_url TEXT,
    linkedin_url TEXT,
    cover_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`);

await pool.query(`
  CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    referrer_name TEXT NOT NULL,
    referrer_email TEXT NOT NULL,
    referrer_phone TEXT,
    friend_name TEXT NOT NULL,
    friend_email TEXT,
    friend_company TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`);

await pool.query(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    budget TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`);

export default pool;
