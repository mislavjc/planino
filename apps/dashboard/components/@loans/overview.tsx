import React from 'react';

import { getLoansForCalulation } from 'actions/loan';

import { LoanTable } from './table';

export const Overview = async ({ organization }: { organization: string }) => {
  const loansForCalculation = await getLoansForCalulation(organization);

  const minYear = Math.min(
    ...loansForCalculation.map((loan) => loan.startingYear),
  );
  const maxYear = Math.max(
    ...loansForCalculation.map((loan) => loan.endingYear),
  );
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i,
  );

  return <LoanTable loans={loansForCalculation} years={years} />;
};
