import { createOpenAI } from '@ai-sdk/openai';
import { S3Client } from '@aws-sdk/client-s3';
import { R2Bucket } from '@cloudflare/workers-types';
import { OpenAPIHono } from '@hono/zod-openapi';

type Env = {
  DATABASE_URL: string;
  BUCKET: R2Bucket;
  OPENAI_API_KEY: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_ENDPOINT: string;
  R2_BUCKET_NAME: string;
};

export const app = new OpenAPIHono<{ Bindings: Env }>();

export const getR2Client = (env: Env) => {
  const awsClient = new S3Client({
    region: 'auto',
    endpoint: env.R2_ENDPOINT,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });

  return awsClient;
};

export const getOpenAIClient = (env: Env) => {
  const openai = createOpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  return openai;
};
