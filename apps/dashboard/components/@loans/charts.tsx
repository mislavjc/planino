import { getLoansForCalulation } from 'actions/loan';

import { TypographyH4 } from 'ui/typography';

import { BarStackChart } from 'components/@charts/bar-stack';

import { getLoanPaymentData } from 'lib/loans';

export const Charts = async ({ organization }: { organization: string }) => {
  const loansForCalculation = await getLoansForCalulation(organization);

  const loanData = getLoanPaymentData(loansForCalculation);

  return (
    <div className="grid lg:grid-cols-2">
      {loanData.map((loan) => (
        <div key={loan.name} className="h-[60vh]">
          <TypographyH4>{loan.name}</TypographyH4>
          <BarStackChart key={loan.name} data={loan.values} />
        </div>
      ))}
    </div>
  );
};
