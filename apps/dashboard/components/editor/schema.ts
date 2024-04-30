import { z } from 'zod';

const textContentSchema = z.object({
  type: z.literal('text'),
  text: z.string().optional(),
});

const paragraphContentSchema = z.object({
  type: z.literal('paragraph'),
  content: z.array(textContentSchema).optional(),
});

const headingContentSchema = z.object({
  type: z.literal('heading'),
  attrs: z.object({
    level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  }),
  content: z.array(textContentSchema).optional(),
});

const listItemContentSchema = z.object({
  type: z.literal('listItem'),
  content: z.array(paragraphContentSchema).optional(),
});

const bulletListContentSchema = z.object({
  type: z.literal('bulletList'),
  attrs: z.object({
    tight: z.boolean(),
  }),
  content: z.array(listItemContentSchema).optional(),
});

const documentContentSchema = z.union([
  paragraphContentSchema,
  headingContentSchema,
  bulletListContentSchema,
]);

export const documentSchema = z.object({
  type: z.literal('doc'),
  content: z.array(documentContentSchema),
});
