import { BarChart } from '@planino/charts';

import { getMonthlyEarnings } from 'actions/output';

import { Card, CardContent, CardHeader } from 'ui/card';
import { TypographyH3 } from 'ui/typography';

import { EarningsTable } from 'components/@output/earnings-table';

const EarningsPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const earnings = await getMonthlyEarnings(organization);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <TypographyH3>Prihodi</TypographyH3>
        </CardHeader>
        <CardContent>
          <EarningsTable earnings={earnings} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <TypographyH3>Prihodi</TypographyH3>
        </CardHeader>
        <CardContent>
          <BarChart
            data={earnings.values}
            categories={
              earnings.values.length > 0
                ? Object.keys(earnings.values[0]).filter(
                    (key) => key !== 'month',
                  )
                : []
            }
            index="month"
            className="h-[50vh]"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsPage;
