import dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({
  path: '.env.local',
});

export default {
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
