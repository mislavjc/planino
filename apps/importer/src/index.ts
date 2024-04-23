import { neon } from '@neondatabase/serverless';
import { schema } from '@planino/database';
import { apiReference } from '@scalar/hono-api-reference';
import { drizzle } from 'drizzle-orm/neon-http';
import { importRoutes } from 'routes/import';

import { app } from 'utils/bindings';

app.route('/', importRoutes);

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Importer API Reference',
  },
});

app.get(
  '/reference',
  apiReference({
    pageTitle: 'Importer API Reference',
    spec: {
      url: '/doc',
    },
  }),
);

app.get('/', async (c) => {
  const sql = neon(c.env.DATABASE_URL);

  const db = drizzle(sql, { schema });

  const result = await db.query.teams.findMany();

  return c.json(result);
});

export default app;
