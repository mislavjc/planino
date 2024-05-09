import { z } from 'zod';

const baseContentSchema = z.object({
  type: z.string(),
});

const textContentSchema = baseContentSchema.extend({
  type: z.literal('text'),
  text: z.string().optional(),
});

const hardBreakContentSchema = baseContentSchema.extend({
  type: z.literal('hardBreak'),
});

const paragraphContentSchema = baseContentSchema.extend({
  type: z.literal('paragraph'),
  content: z
    .array(z.union([textContentSchema, hardBreakContentSchema]))
    .optional(),
});

const headingContentSchema = baseContentSchema.extend({
  type: z.literal('heading'),
  attrs: z
    .object({
      level: z.number(),
    })
    .optional(),
  content: z.array(textContentSchema).optional(),
});

const codeBlockContentSchema = baseContentSchema.extend({
  type: z.literal('codeBlock'),
  attrs: z
    .object({
      language: z.string().nullable(),
    })
    .optional(),
  content: z.array(textContentSchema).optional(),
});

const listItemContentSchema = baseContentSchema.extend({
  type: z.literal('listItem'),
  content: z.array(paragraphContentSchema).optional(),
});

const bulletListContentSchema = baseContentSchema.extend({
  type: z.literal('bulletList'),
  attrs: z.object({ tight: z.boolean().optional() }).optional(),
  content: z.array(listItemContentSchema),
});

const documentContentSchema = z.discriminatedUnion('type', [
  headingContentSchema,
  paragraphContentSchema,
  codeBlockContentSchema,
  hardBreakContentSchema,
  bulletListContentSchema,
  listItemContentSchema,
]);

export const documentSchema = z.object({
  type: z.literal('doc'),
  content: z.array(documentContentSchema),
});
