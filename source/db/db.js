import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

// Verify database connection
pool.on('connect', () => {
  console.log('✓ Database connection established');
});

pool.on('error', (err) => {
  console.error('✗ Database connection error:', err);
});

// Test connection on startup
try {
  await pool.query('SELECT 1');
  console.log('✓ Database is accessible');
} catch (error) {
  console.error('✗ Database connection failed:', error.message);
}
