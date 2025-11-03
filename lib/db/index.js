import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';
import dns from 'dns';

// Prefer IPv4 first to avoid IPv6-only DNS issues on some networks
try {
  // Node 18+: set DNS result order
  // If not supported, it will throw, which we ignore
  dns.setDefaultResultOrder('ipv4first');
} catch {}

// Database connection
const connectionString = process.env.DATABASE_URL;

// Check if we have a database connection string
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Real PostgreSQL connection (works with Supabase and local Postgres)
const shouldUseSsl =
  process.env.NODE_ENV === 'production' ||
  /supabase/i.test(connectionString) ||
  /sslmode=require/i.test(connectionString);

const pool = new Pool({
  connectionString: connectionString,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
});

// Handle SSL certificate issues for Supabase
if (process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const db = drizzle(pool, { schema });

export { db };

// Export schema for use in other files
export * from './schema.js';