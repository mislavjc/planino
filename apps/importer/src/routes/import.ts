import { createRoute, z } from '@hono/zod-openapi';

import { app } from 'utils/bindings';

const importPayloadSchema = z.object({
  content: z.string().url(),
});

const postImport = createRoute({
  method: 'post',
  tags: ['import'],
  path: '/import',
  request: {
    body: {
      content: {
        'application/json': {
          schema: importPayloadSchema.openapi('Import data payload schema'),
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
              },
            },
          },
        },
      },
      description: 'Import data',
    },
  },
});

app.openapi(postImport, async (c) => {
  const { content } = c.req.valid('json');

  return c.json({ success: true, content });
});

export { app as importRoutes };
