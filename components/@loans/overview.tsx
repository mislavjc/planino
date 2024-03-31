import React from 'react';
import { getLoansForCalulation } from 'actions/loan';
import { ipmt, pmt, ppmt } from 'financial';

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

            const loanDurationMonths = loan.duration * 12;
            const loanInterestRateMonthly =
              parseFloat(loan.interestRate) / 100 / 12;
            const loanAmount = loan.amount;

            const monthlyPMT = pmt(
              loanInterestRateMonthly,
              loanDurationMonths,
              -loanAmount,
            );
            const yearlyPMT = monthlyPMT * 12;

            return (
              <React.Fragment key={loan.loanId}>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {loan.name}
                  </td>
                  {years.map((year) => {
                    if (year < loan.startingYear || year > loan.endingYear) {
                      return (
                        <td
                          key={year}
                          className="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
                        >
                          -
                        </td>
                      );
                    }

                    let yearlyPPMT = 0;
                    let yearlyIPMT = 0;

                    for (let month = 1; month <= 12; month++) {
                      const period = (year - loan.startingYear) * 12 + month;
                      if (period <= loanDurationMonths) {
                        yearlyPPMT += ppmt(
                          loanInterestRateMonthly,
                          period,
                          loanDurationMonths,
                          -loanAmount,
                        );
                        yearlyIPMT += ipmt(
                          loanInterestRateMonthly,
                          period,
                          loanDurationMonths,
                          -loanAmount,
                        );
                      }
                    }

                    return (
                      <td
                        key={year}
                        className="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
                      >
                        <div>
                          PMT:{' '}
                          {yearlyPMT.toLocaleString('hr-HR', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </div>
                        <div>
                          PPMT:{' '}
                          {yearlyPPMT.toLocaleString('hr-HR', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </div>
                        <div>
                          IPMT:{' '}
                          {yearlyIPMT.toLocaleString('hr-HR', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
