import { neon } from '@neondatabase/serverless';
import { schema } from '@planino/database';
import { drizzle } from 'drizzle-orm/neon-http';
import { Hono } from 'hono';

export type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
  const sql = neon(c.env.DATABASE_URL);

  const db = drizzle(sql, { schema });

  const result = await db.query.teams.findMany();

  return c.json(result);
});

export default app;
