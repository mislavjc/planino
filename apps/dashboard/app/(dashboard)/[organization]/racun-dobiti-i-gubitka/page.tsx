import { getMonthlyAggregateCostsAndSales } from 'actions/output';

import { Card, CardContent, CardHeader } from 'ui/card';
import { TypographyH3 } from 'ui/typography';

import { ProfitLossTable } from 'components/@output/profit-loss-table';

const ProfitAndLossPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const data = await getMonthlyAggregateCostsAndSales(organization);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <TypographyH3>Račun dobiti i gubitka</TypographyH3>
        </CardHeader>
        <CardContent>
          <ProfitLossTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitAndLossPage;
