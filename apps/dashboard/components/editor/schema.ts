import { z } from 'zod';

export const JSONContentSchema: z.ZodSchema<any> = z.lazy(() =>
  z
    .object({
      type: z.string().optional(),
      attrs: z.record(z.any()).optional(),
      content: z.array(JSONContentSchema).optional(),
      marks: z
        .array(
          z
            .object({
              type: z.string(),
              attrs: z.record(z.any()).optional(),
            })
            .catchall(z.any()),
        )
        .optional(),
      text: z.string().optional(),
    })
    .catchall(z.any()),
);
