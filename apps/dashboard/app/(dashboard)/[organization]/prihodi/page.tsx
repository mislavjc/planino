import { BarChart } from '@planino/charts';

import { getMonthlyEarnings } from 'actions/output';

const EarningsPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const earnings = await getMonthlyEarnings(organization);

  return (
    <div>
      <BarChart
        data={earnings.values}
        categories={
          earnings.values.length > 0
            ? Object.keys(earnings.values[0]).filter((key) => key !== 'month')
            : []
        }
        index="month"
        className="h-[50vh]"
      />
    </div>
  );
};

export default EarningsPage;
