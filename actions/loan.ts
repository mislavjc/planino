'use server';

import { db } from 'db/drizzle';
import { insertLoanSchema, loans } from 'db/schema';
import { and, eq, isNotNull, sql } from 'drizzle-orm';
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
      error: 'Kredit već postoji.',
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

export const updateLoan = async (data: Partial<LoanInsertInput>) => {
  if (!data.loanId) {
    return {
      error: 'ID Kredita je potreban.',
    };
  }

  const loan = await db
    .update(loans)
    .set(data)
    .where(eq(loans.loanId, data.loanId))
    .returning();

  if (!loan.length) {
    return {
      error: 'Kredit nije pronađen.',
    };
  }

  revalidatePath('/[organization]/otplatni-plan', 'page');
};

export const getLoansForCalulation = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  if (!foundOrganization) {
    return [];
  }

  const dbLoans = await db
    .select({
      loanId: loans.loanId,
      name: loans.name,
      interestRate: loans.interestRate,
      duration: loans.duration,
      startingYear: sql<number>`DATE_PART('year', ${loans.startingMonth})`,
      endingYear: sql<number>`DATE_PART('year', ${loans.startingMonth}) + ${loans.duration} - 1`,
      amount: loans.amount,
    })
    .from(loans)
    .where(
      and(
        eq(loans.organizationId, foundOrganization.organizationId),
        isNotNull(loans.name),
        isNotNull(loans.interestRate),
        isNotNull(loans.duration),
        isNotNull(loans.startingMonth),
        isNotNull(loans.amount),
      ),
    )
    .orderBy(loans.createdAt);

  return dbLoans;
};
