'use server';

import { db } from 'db/drizzle';
import {
  expenseFrequencies,
  expenses,
  expenseTypes,
  financialAttributes,
  insertExpenseSchema,
  insertFinancialAttributeSchema,
  teams,
} from 'db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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
        orderBy: (expenses, { desc }) => [desc(expenses.createdAt)],
      },
    },
    orderBy: (expenses, { desc }) => [desc(expenses.createdAt)],
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

type InsertExpense = z.infer<typeof insertExpenseSchema>;

type InsertFinancialAttribute = z.infer<typeof insertFinancialAttributeSchema>;

type UpdateExpense = {
  expense?: Partial<InsertExpense>;
  financialAttribute?: Partial<InsertFinancialAttribute>;
};

export const updateExpense = async (payload: UpdateExpense) => {
  if (!payload.expense && !payload.financialAttribute) {
    throw new Error('Nedostaju podaci za ažuriranje troška.');
  }

  if (payload.expense && !payload.expense.expenseId) {
    throw new Error('Nedostaje identifikator troška.');
  }

  if (payload.expense) {
    const parsedExpense = insertExpenseSchema.parse(payload.expense);

    if (!parsedExpense.expenseId) {
      throw new Error('Nedostaje identifikator troška.');
    }

    const updatedExpense = await db
      .update(expenses)
      .set(parsedExpense)
      .where(eq(expenses.expenseId, parsedExpense.expenseId))
      .returning();

    if (!updatedExpense.length) {
      throw new Error('Neuspjelo ažuriranje troška.');
    }
  }

  if (
    payload.financialAttribute &&
    !payload.financialAttribute.financialAttributeId
  ) {
    throw new Error('Nedostaje identifikator financijskog atributa.');
  }

  if (payload.financialAttribute) {
    const parsedFinancialAttribute = insertFinancialAttributeSchema.parse(
      payload.financialAttribute,
    );

    if (!parsedFinancialAttribute.financialAttributeId) {
      throw new Error('Nedostaje identifikator financijskog atributa.');
    }

    const updatedFinancialAttribute = await db
      .update(financialAttributes)
      .set(parsedFinancialAttribute)
      .where(
        eq(
          financialAttributes.financialAttributeId,
          parsedFinancialAttribute.financialAttributeId,
        ),
      )
      .returning();

    if (!updatedFinancialAttribute.length) {
      throw new Error('Neuspjelo ažuriranje financijskog atributa.');
    }
  }
};
