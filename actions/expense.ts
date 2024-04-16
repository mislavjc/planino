'use server';

import { db } from 'db/drizzle';
import { YEARLY_EXPENSE_AGREGATION } from 'db/queries';
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
    team_id: z.string(),
    expense_id: z.string(),
    expense_name: z.string(),
    team_name: z.string(),
    financial_year: z.coerce.number(),
    total_amount: z.string(),
  }),
);

export const getYearlyExpenseAggregation = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const result = (
    await db.execute(
      YEARLY_EXPENSE_AGREGATION(foundOrganization.organizationId),
    )
  ).rows;

  const parsedResult = yearlyExpenseAggregationSchema.parse(result);

  const organizedExpenses = organizeExpenses(parsedResult);

  return organizedExpenses;
};

type ExpenseAggregation = z.infer<typeof yearlyExpenseAggregationSchema>;

const organizeExpenses = (expenseSums: ExpenseAggregation) => {
  if (!expenseSums) {
    return [];
  }

  const yearlyMap = new Map<number, Map<string, ExpenseAggregation>>();

  expenseSums.forEach((expense) => {
    if (!yearlyMap.has(expense.financial_year)) {
      yearlyMap.set(expense.financial_year, new Map());
    }
    const groupMap = yearlyMap.get(expense.financial_year);
    if (!groupMap?.has(expense.team_name)) {
      groupMap?.set(expense.team_name, []);
    }
    groupMap?.get(expense.team_name)?.push(expense);
  });

  return Array.from(yearlyMap)
    .sort(([yearA], [yearB]) => yearA - yearB)
    .map(([year, groupMap]) => ({
      year,
      groups: Array.from(groupMap).map(([TeamExpenseId, expenses]) => ({
        grouped_expense_id: TeamExpenseId,
        expenses,
      })),
    }));
};
