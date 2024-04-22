import { z } from 'zod';

/**
 * Converts a ZodObject schema into an updated schema where all properties are optional.
 *
 * @template T - The shape of the original ZodObject schema.
 * @param {z.ZodObject<T>} schema - The original ZodObject schema.
 * @returns {z.ZodObject<{ [P in keyof T]: z.ZodOptional<T[P]> }>} - The updated ZodObject schema with optional properties.
 */
export const toUpdateSchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
): z.ZodObject<{ [P in keyof T]: z.ZodOptional<T[P]> }> => {
  const newShape = {} as { [P in keyof T]: z.ZodOptional<T[P]> };

  for (const key in schema.shape) {
    newShape[key as keyof T] = schema.shape[key].optional();
  }

  return z.object(newShape);
};
