'use server';

import { db } from 'db/drizzle';
import { insertInventoryItemSchema, inventoryItems, teams } from 'db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { toUpdateSchema } from 'lib/zod';

import { getOrganization } from './organization';

export const getInventoryItems = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const teamsWithInventoryItems = await db.query.teams.findMany({
    where: eq(teams.organizationId, foundOrganization.organizationId),
    with: {
      inventoryItems: true,
    },
  });

  return teamsWithInventoryItems;
};

export const createInventoryItem = async ({
  organization,
  teamId,
}: {
  organization: string;
  teamId: string;
}) => {
  await getOrganization(organization);

  const newInventoryItem = await db
    .insert(inventoryItems)
    .values({
      teamId,
    })
    .returning();

  if (!newInventoryItem.length) {
    throw new Error('Neuspjelo kreiranje unosa.');
  }

  revalidatePath('/[organization]/imovina-i-oprema', 'page');

  return newInventoryItem[0];
};

const updateInventoryItemSchema = toUpdateSchema(insertInventoryItemSchema);

type UpdateInventoryItem = z.infer<typeof updateInventoryItemSchema>;

export const updateInventoryItem = async (payload: UpdateInventoryItem) => {
  const parsedPayload = updateInventoryItemSchema.parse(payload);

  if (!parsedPayload.inventoryItemId) {
    throw new Error('Nedostaje identifikator inventurne stavke.');
  }

  await db
    .update(inventoryItems)
    .set(parsedPayload)
    .where(eq(inventoryItems.inventoryItemId, parsedPayload.inventoryItemId));
};
