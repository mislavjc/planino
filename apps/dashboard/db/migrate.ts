import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

dotenv.config({
  path: '.env.local',
});

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql);

const runMigration = async () => {
  await migrate(db, {
    migrationsFolder: './db/migrations',
  });
};

runMigration();
