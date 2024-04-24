import { R2Bucket } from '@cloudflare/workers-types';
import { OpenAPIHono } from '@hono/zod-openapi';

type Env = {
  DATABASE_URL: string;
  BUCKET: R2Bucket;
};

export const app = new OpenAPIHono<{ Bindings: Env }>();
