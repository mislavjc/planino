import { getLoans, getLoansForCalulation } from 'actions/loan';
import { Metadata } from 'next';

import { Card, CardContent, CardHeader } from 'ui/card';
import { ScrollArea, ScrollBar } from 'ui/scroll-area';
import { TypographyH3, TypographyP } from 'ui/typography';

import { AddRow } from 'components/@loans/add-row';
import { Row } from 'components/@loans/row';

export const metadata: Metadata = {
  title: 'Otplatni plan - Planino',
};

const PaymentPlanPage = async ({
  params: { organization },
}: {
  params: {
    organization: string;
  };
}) => {
  const loans = await getLoans(organization);

  const loansForCalculation = await getLoansForCalulation(organization);

  return (
    <div>
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <TypographyH3>Otplatni plan</TypographyH3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <ScrollArea className="min-w-[40rem]">
            <div>
              <div className="grid grid-cols-7 text-sm">
                <TypographyP className="col-span-2">Naziv</TypographyP>
                <TypographyP className="text-right">Kamata</TypographyP>
                <TypographyP className="text-right">Broj rata</TypographyP>
                <TypographyP className="text-right">Iznos</TypographyP>
                <TypographyP className="col-span-2 text-right">
                  Prvi mjesec
                </TypographyP>
              </div>
              <div>
                {loans.map((loan) => (
                  <Row key={loan.loanId} {...loan} />
                ))}
              </div>
              <AddRow organization={organization} />
            </div>
            <ScrollBar />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPlanPage;
