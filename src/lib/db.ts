import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

// Cache connection in development to avoid too many connections on fast refresh
const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof neon> | undefined;
};

const sql = globalForDb.conn ?? neon(process.env.DATABASE_URL || "postgres://localhost:5432/db");

if (process.env.NODE_ENV !== 'production') {
  globalForDb.conn = sql;
}

export const db = drizzle(sql, { schema });
