import { z } from '@hono/zod-openapi';

export const IdParamsSchema = z.object({
  id: z
    .string()
    .length(36)
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '7ccbd657-431e-4e94-a05f-a585bfe9b655',
    }),
});
