import { BarChart } from '@planino/charts';

import { getLoansForCalulation } from 'actions/loan';

import { TypographyH4 } from 'ui/typography';

import { getLoanPaymentData } from 'lib/loans';

export const Charts = async ({ organization }: { organization: string }) => {
  const loansForCalculation = await getLoansForCalulation(organization);

  const loanData = getLoanPaymentData(loansForCalculation);

  return (
    <div className="grid xl:grid-cols-2">
      {loanData.map((loan) => {
        return loan.values.length ? (
          <div key={loan.name}>
            <TypographyH4>{loan.name}</TypographyH4>
            <div className="h-[60vh]">
              <BarChart
                key={loan.name}
                data={loan.values}
                className="h-[50vh]"
                index="year"
                type="stacked"
                categories={
                  loan.values.length > 0
                    ? Object.keys(loan.values[0]).filter(
                        (key) => key !== 'year',
                      )
                    : []
                }
              />
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
};
