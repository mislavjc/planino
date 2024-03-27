import { getLoans } from 'actions/loan';
import { Metadata } from 'next';

import { Card, CardContent, CardHeader } from 'ui/card';
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

  return (
    <div>
      <Card className="md:w-1/2">
        <CardHeader>
          <TypographyH3>Otplatni plan</TypographyH3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 text-sm">
            <TypographyP className="col-span-2">Naziv</TypographyP>
            <TypographyP className="text-right">Kamata</TypographyP>
            <TypographyP className="text-right">Broj rata</TypographyP>
            <TypographyP className="text-right">Prvi mjesec</TypographyP>
            <TypographyP className="text-right">Iznos</TypographyP>
          </div>
          <div>
            {loans.map((loan) => (
              <Row key={loan.loanId} {...loan} />
            ))}
          </div>
          <AddRow organization={organization} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPlanPage;
