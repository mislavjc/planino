import { neon } from '@neondatabase/serverless';
import { schema } from '@planino/database';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
