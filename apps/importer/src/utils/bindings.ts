import { OpenAPIHono } from '@hono/zod-openapi';

type Env = {
  DATABASE_URL: string;
};

export const app = new OpenAPIHono<{ Bindings: Env }>();
