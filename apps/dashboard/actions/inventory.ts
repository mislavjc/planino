'use server';

import {
  insertInventoryItemSchema,
  inventoryItems,
  teams,
} from '@planino/database/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { db } from 'db/drizzle';
import { INVENTORY_VALUES } from 'db/queries';

import { toUpdateSchema } from 'lib/zod';

import { getOrganization } from './organization';

export const getInventoryItems = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const teamsWithInventoryItems = await db.query.teams.findMany({
    where: eq(teams.organizationId, foundOrganization.organizationId),
    with: {
      inventoryItems: {
        orderBy: (inventoryItems, { asc }) => [
          asc(inventoryItems.startingMonth),
        ],
      },
    },
    orderBy: (teams, { asc }) => [asc(teams.createdAt)],
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

export const deleteInventoryItem = async (inventoryItemId: string) => {
  await db
    .delete(inventoryItems)
    .where(eq(inventoryItems.inventoryItemId, inventoryItemId));

  revalidatePath('/[organization]/imovina-i-oprema', 'page');
};

export const clearInventoryItem = async (inventoryItemId: string) => {
  await db
    .update(inventoryItems)
    .set({
      amortizationLength: null,
      name: null,
      startingMonth: null,
      value: null,
    })
    .where(eq(inventoryItems.inventoryItemId, inventoryItemId));

  revalidatePath('/[organization]/imovina-i-oprema', 'page');
};

export const duplicateInventoryItem = async (inventoryItemId: string) => {
  const inventoryItem = await db.query.inventoryItems.findFirst({
    where: eq(inventoryItems.inventoryItemId, inventoryItemId),
  });

  if (!inventoryItem) {
    throw new Error('Inventurna stavka nije pronađena.');
  }

  const newInventoryItem = await db
    .insert(inventoryItems)
    .values({
      teamId: inventoryItem.teamId,
      amortizationLength: inventoryItem.amortizationLength,
      name: inventoryItem.name,
      startingMonth: inventoryItem.startingMonth,
      value: inventoryItem.value,
    })
    .returning();

  if (!newInventoryItem.length) {
    throw new Error('Neuspjelo dupliciranje inventurne stavke.');
  }

  revalidatePath('/[organization]/imovina-i-oprema', 'page');

  return newInventoryItem[0];
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

  const result = (
    await db.execute(INVENTORY_VALUES(foundOrganization.organizationId))
  ).rows;

  const startYear = await db
    .select({
      startYear: sql<string>`EXTRACT(YEAR FROM starting_month)`,
    })
    .from(inventoryItems)
    .innerJoin(teams, eq(inventoryItems.teamId, teams.teamId))
    .where(eq(teams.organizationId, foundOrganization.organizationId))
    .orderBy(inventoryItems.startingMonth)
    .limit(1);

  const parsedResult = inventoryValuesSchema.parse(result);

  if (!parsedResult.length) {
    return {
      values: [],
      years: [],
      numberOfYears: 0,
    };
  }

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
