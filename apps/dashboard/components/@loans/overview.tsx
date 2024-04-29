import React from 'react';

import { getLoansForCalulation } from 'actions/loan';

import { calculatePayments, renderYearlyData } from 'lib/loans';

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

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th>Godina</th>
            {years.map((year) => (
              <th key={year}>{year}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {loansForCalculation.map((loan) => {
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
