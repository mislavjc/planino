'use server';

import { blocks } from '@planino/database/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from 'db/drizzle';

export const createBlock = async (formData: FormData) => {
  const businessPlanId = formData.get('business_plan_id') as string;

  const newBlock = await db
    .insert(blocks)
    .values({
      businessPlanId,
    })
    .returning();

  if (!newBlock) {
    throw new Error('Failed to create block');
  }

  revalidatePath('/[organization]/poslovni-planovi/[businessPlanId]', 'page');
};

export const updateBlock = async ({
  blockId,
  content,
}: {
  blockId: string;
  content: unknown;
}) => {
  await db
    .update(blocks)
    .set({
      content: content,
    })
    .where(eq(blocks.blockId, blockId));

  revalidatePath('/[organization]/poslovni-planovi/[businessPlanId]', 'page');
};
