'use server';

import { db } from 'db/drizzle';
import { INVENTORY_VALUES } from 'db/queries';
import { insertInventoryItemSchema, inventoryItems, teams } from 'db/schema';
import { eq, sql } from 'drizzle-orm';
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

  revalidatePath('/[organization]/imovina-i-oprema', 'page');
};

const inventoryValuesSchema = z.array(
  z.object({
    team_name: z.string(),
    item_name: z.string(),
    yearly_values: z.array(z.number().nullable()),
  }),
);

export const getInventoryValues = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const result = (await db.execute(INVENTORY_VALUES)).rows;

  const startYear = await db
    .select({
      startYear: sql<string>`EXTRACT(YEAR FROM starting_month)`,
    })
    .from(inventoryItems)
    .orderBy(inventoryItems.startingMonth)
    .limit(1);

  const parsedResult = inventoryValuesSchema.parse(result);

  const numberOfYears = parsedResult[0].yearly_values.length;

  const years = Array.from({ length: numberOfYears }, (_, i) => {
    return String(Number(startYear[0].startYear) + i);
  });

  return {
    values: parsedResult,
    years,
    numberOfYears,
  };
};
