import { Metadata } from 'next';

import { Card, CardContent, CardHeader } from 'ui/card';
import { TypographyH3, TypographyP } from 'ui/typography';

import { Row } from 'components/@loans/row';

export const metadata: Metadata = {
  title: 'Otplatni plan - Planino',
};

const PaymentPlanPage = () => {
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
            <Row
              name="Kredit"
              interestRate={0.05}
              duration={12}
              startingMonth={1}
              amount={1000}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPlanPage;
