'use server';

import { db } from 'db/drizzle';
import {
  expenseFrequencies,
  expenses,
  expenseTypes,
  financialAttributes,
  teams,
} from 'db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { getOrganization } from './organization';

export const getOperationalExpenses = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const foundExpenses = await db.query.teams.findMany({
    where: eq(teams.organizationId, foundOrganization.organizationId),
    with: {
      expenses: {
        with: {
          financialAttribute: true,
          expenseFrequency: true,
          expenseType: true,
        },
      },
    },
  });

  return foundExpenses;
};

export const createExpense = async ({
  organization,
  teamId,
}: {
  organization: string;
  teamId: string;
}) => {
  await getOrganization(organization);

  const financialAttribute = await db
    .insert(financialAttributes)
    .values({})
    .returning();

  const expenseFrequency = await db
    .insert(expenseFrequencies)
    .values({})
    .returning();

  const expenseType = await db.insert(expenseTypes).values({}).returning();

  const newExpense = await db
    .insert(expenses)
    .values({
      teamId,
      financialAttributeId: financialAttribute[0].financialAttributeId,
      expenseFrequencyId: expenseFrequency[0].expenseFrequencyId,
      expenseTypeId: expenseType[0].expenseTypeId,
    })
    .returning();

  if (!newExpense.length) {
    throw new Error('Neuspjelo kreiranje troška.');
  }

  revalidatePath('/[organization]/operativni-troskovi', 'page');

  return newExpense[0];
};
