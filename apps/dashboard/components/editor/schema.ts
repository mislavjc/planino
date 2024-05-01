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

const taskItemContentSchema = z.object({
  type: z.literal('taskItem'),
  attrs: z.object({
    checked: z.boolean(),
  }),
  content: z.array(paragraphContentSchema).optional(),
});

const taskListContentSchema = z.object({
  type: z.literal('taskList'),
  content: z.array(taskItemContentSchema).optional(),
});

const documentContentSchema = z.union([
  headingContentSchema,
  paragraphContentSchema,
  taskListContentSchema,
]);

const documentSchema = z.object({
  type: z.literal('doc'),
  content: z.array(documentContentSchema).optional(),
});

export { documentSchema };
