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
    <div className="grid grid-cols-1 gap-4">
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
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-1">{loan.name}</div>
              <div className="col-span-3 grid grid-cols-3 gap-2">
                <div className="text-sm">
                  <div className="font-bold">PMT:</div>
                </div>
                <div className="text-sm">
                  <div className="font-bold">PPMT:</div>
                </div>
                <div className="text-sm">
                  <div className="font-bold">IPMT:</div>
                </div>
                {years.map((year) => {
                  if (year < loan.startingYear || year > loan.endingYear) {
                    return <div key={year} />;
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
                    <div key={year} className="grid grid-cols-3 gap-2">
                      <div className="text-sm">
                        {yearlyPMT.toLocaleString('hr-HR', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </div>
                      <div className="text-sm">
                        {yearlyPPMT.toLocaleString('hr-HR', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </div>
                      <div className="text-sm">
                        {yearlyIPMT.toLocaleString('hr-HR', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
