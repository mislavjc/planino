'use server';

import { db } from 'db/drizzle';
import { insertLoanSchema, loans } from 'db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getOrganization } from './organization';

type LoanInsertInput = z.infer<typeof insertLoanSchema>;

export const createLoan = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const loan = await db
    .insert(loans)
    .values({
      organizationId: foundOrganization.organizationId,
    })
    .onConflictDoNothing()
    .returning();

  if (!loan.length) {
    return {
      error: 'Loan already exists.',
    };
  }

  revalidatePath('/[organization]/otplatni-plan', 'page');

  return {
    loan: loan[0],
  };
};

export const getLoans = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  if (!foundOrganization) {
    return [];
  }

  const dbLoans = await db
    .select()
    .from(loans)
    .where(eq(loans.organizationId, foundOrganization.organizationId));

  return dbLoans;
};
