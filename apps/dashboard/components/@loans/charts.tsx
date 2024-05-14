import { getLoansForCalulation } from 'actions/loan';

import { TypographyH4 } from 'ui/typography';

import { BarStackChart } from 'components/@charts/bar-stack';

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
              <BarStackChart
                key={loan.name}
                data={loan.values}
                domainKey="year"
              />
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
};
