'use server';

import { insertLoanSchema, loans } from '@planino/database/schema';
import { and, eq, isNotNull, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { db } from 'db/drizzle';

import { toUpdateSchema } from 'lib/zod';

import { getOrganization } from './organization';

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

const updateLoanSchema = toUpdateSchema(insertLoanSchema);

type UpdateLoan = z.infer<typeof updateLoanSchema>;

export const updateLoan = async (payload: UpdateLoan) => {
  const parsedPayload = updateLoanSchema.parse(payload);

  if (!parsedPayload.loanId) {
    return {
      error: 'ID Kredita je potreban.',
    };
  }

  const loan = await db
    .update(loans)
    .set(parsedPayload)
    .where(eq(loans.loanId, parsedPayload.loanId))
    .returning();

  if (!loan.length) {
    return {
      error: 'Kredit nije pronađen.',
    };
  }

  revalidatePath('/[organization]/otplatni-plan', 'page');
};

export const deleteLoan = async (loanId: string) => {
  await db.delete(loans).where(eq(loans.loanId, loanId));

  revalidatePath('/[organization]/imovina-i-oprema', 'page');
};

export const clearLoan = async (loanId: string) => {
  const clearedLoan = await db
    .update(loans)
    .set({
      name: null,
      interestRate: null,
      duration: null,
      startingMonth: null,
      amount: null,
    })
    .where(eq(loans.loanId, loanId))
    .returning();

  if (!clearedLoan.length) {
    throw new Error('Neuspjelo brisanje kredita.');
  }

  revalidatePath('/[organization]/imovina-i-oprema', 'page');
};

export const duplicateLoan = async (loanId: string) => {
  const foundLoan = await db.query.loans.findFirst({
    where: eq(loans.loanId, loanId),
  });

  if (!foundLoan) {
    throw new Error('Kredit nije pronađen.');
  }

  const loan = await db
    .insert(loans)
    .values({
      organizationId: foundLoan.organizationId,
      name: foundLoan.name,
      interestRate: foundLoan.interestRate,
      duration: foundLoan.duration,
      startingMonth: foundLoan.startingMonth,
      amount: foundLoan.amount,
    })
    .returning();

  if (!loan.length) {
    throw new Error('Neuspjelo dupliciranje kredita.');
  }

  revalidatePath('/[organization]/imovina-i-oprema', 'page');
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
