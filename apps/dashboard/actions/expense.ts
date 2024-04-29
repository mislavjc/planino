'use server';

import {
  expenseFrequencies,
  expenses,
  expenseTypes,
  financialAttributes,
  insertExpenseSchema,
  insertFinancialAttributeSchema,
  teams,
} from '@planino/database/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { db } from 'db/drizzle';
import { YEARLY_EXPENSE_AGREGATION } from 'db/queries';

import { toUpdateSchema } from 'lib/zod';

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
        orderBy: (expenses, { asc }) => [asc(expenses.createdAt)],
      },
    },
    orderBy: (teams, { asc }) => [asc(teams.createdAt)],
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

const updateExpenseSchema = toUpdateSchema(insertExpenseSchema);
type UpdateExpense = z.infer<typeof updateExpenseSchema>;

const updatedFinancialAttributeSchema = toUpdateSchema(
  insertFinancialAttributeSchema,
);
type UpdateFinancialAttribute = z.infer<typeof updatedFinancialAttributeSchema>;

type UpdateExpenseProps = {
  expense?: UpdateExpense;
  financialAttribute?: UpdateFinancialAttribute;
};

export const updateExpense = async (payload: UpdateExpenseProps) => {
  if (!payload.expense && !payload.financialAttribute) {
    throw new Error('Nedostaju podaci za ažuriranje troška.');
  }

  if (payload.expense && !payload.expense.expenseId) {
    throw new Error('Nedostaje identifikator troška.');
  }

  if (payload.expense) {
    const parsedExpense = updateExpenseSchema.parse(payload.expense);

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
    const parsedFinancialAttribute = updatedFinancialAttributeSchema.parse(
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

  revalidatePath('/[organization]/operativni-troskovi', 'page');
};

const yearlyExpenseAggregationSchema = z.array(
  z.object({
    team_name: z.string(),
    item_name: z.string(),
    yearly_values: z.array(z.number().nullable()),
  }),
);

export const getYearlyExpenseAggregation = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const result = (
    await db.execute(
      YEARLY_EXPENSE_AGREGATION(foundOrganization.organizationId),
    )
  ).rows;

  const startYear = await db
    .select({
      startYear: sql<string>`EXTRACT(YEAR FROM financial_attribute.starting_month)`,
    })
    .from(expenses)
    .innerJoin(
      financialAttributes,
      eq(
        expenses.financialAttributeId,
        financialAttributes.financialAttributeId,
      ),
    )
    .innerJoin(teams, eq(expenses.teamId, teams.teamId))
    .where(eq(teams.organizationId, foundOrganization.organizationId))
    .orderBy(financialAttributes.startingMonth)
    .limit(1);

  const parsedResult = yearlyExpenseAggregationSchema.parse(result);

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
