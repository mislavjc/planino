'use server';

import { blocks } from '@planino/database/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from 'db/drizzle';

import { blockOptionsSchema, DbBlockOptions } from 'lib/blocks';

import { getOrganization } from './organization';

export const createBlock = async ({
  organization,
  businessPlanId,
  type,
  content,
}: {
  organization: string;
  businessPlanId: string;
  type: 'component' | 'text';
  content: DbBlockOptions;
}) => {
  await getOrganization(organization);

  const parsedContent = blockOptionsSchema.parse(content);

  const newBlock = await db
    .insert(blocks)
    .values({
      businessPlanId,
      type,
      content: parsedContent,
    })
    .returning();

  if (!newBlock) {
    throw new Error('Neuspjelo kreiranje bloka');
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

export const deleteBlock = async ({ blockId }: { blockId: string }) => {
  await db.delete(blocks).where(eq(blocks.blockId, blockId));

  revalidatePath('/[organization]/poslovni-planovi/[businessPlanId]', 'page');
};
