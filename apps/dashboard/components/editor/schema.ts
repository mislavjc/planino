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
    level: z.number(),
  }),
  content: z.array(textContentSchema).optional(),
});

const listItemContentSchema = z.object({
  type: z.literal('listItem'),
  content: z
    .array(z.union([textContentSchema, paragraphContentSchema]))
    .optional(),
});

const orderedListContentSchema = z.object({
  type: z.literal('orderedList'),
  attrs: z.object({
    tight: z.boolean().optional(),
    start: z.number().optional(),
  }),
  content: z.array(listItemContentSchema).optional(),
});

const documentContentSchema = z.union([
  headingContentSchema,
  paragraphContentSchema,
  orderedListContentSchema,
]);

export const documentSchema = z.object({
  type: z.literal('doc'),
  content: z.array(documentContentSchema).optional(),
});
