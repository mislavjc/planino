import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { useParams } from 'next/navigation';

import { LoanTable } from 'components/@loans/table';

import { useLoansTable } from 'hooks/loans';

export const LoansTable = () => {
  const { organization } = useParams();

  const loansForCalculation = useLoansTable({
    organization: organization as string,
  });

  if (!loansForCalculation) {
    return null;
  }

  const loans = loansForCalculation.loans;

  const minYear = Math.min(...loans.map((loan) => loan.startingYear));
  const maxYear = Math.max(...loans.map((loan) => loan.endingYear));

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i,
  );

  return (
    <NodeViewWrapper className="overflow-auto">
      <LoanTable loans={loansForCalculation.loans} years={years} />
    </NodeViewWrapper>
  );
};
