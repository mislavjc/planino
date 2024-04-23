import { neon } from '@neondatabase/serverless';
import { schema } from '@planino/database';
import { drizzle } from 'drizzle-orm/neon-http';

export const getDb = (DATABASE_URL: string) => {
  const sql = neon(DATABASE_URL);

  return drizzle(sql, { schema });
};
