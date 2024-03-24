import dotenv from 'dotenv';
import { migrate } from 'drizzle-orm/neon-http/migrator';

import { db } from './drizzle';

dotenv.config({
  path: '.env.local',
});

const runMigration = async () => {
  await migrate(db, {
    migrationsFolder: './db/migrations',
  });
};

runMigration();
