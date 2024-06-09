import React from 'react';

import { calculatePayments, renderYearlyData } from 'lib/loans';

type Loan = {
  loanId: string | null;
  name: string | null;
  interestRate: string | null;
  duration: number | null;
  startingYear: number;
  endingYear: number;
  amount: string | null;
};

type LoanTableProps = {
  loans: Loan[];
  years: number[];
};

export const LoanTable = ({ loans, years }: LoanTableProps) => {
  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th>Godina</th>
            {years.map((year) => (
              <th key={year} className="px-4 text-right font-mono">
                {year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {loans.map((loan) => {
            if (
              !loan.startingYear ||
              !loan.endingYear ||
              !loan.amount ||
              !loan.interestRate ||
              !loan.duration
            ) {
              return null;
            }

            return (
              <React.Fragment key={loan.loanId}>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {loan.name}
                  </td>
                  {renderYearlyData(loan, years, calculatePayments)}
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
