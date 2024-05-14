import { getYearlyExpenseAggregation } from 'actions/expense';

import { BarStackChart } from 'components/@charts/bar-stack';
import { TypographyH4 } from 'components/ui/typography';

import { transformAggregateValues } from 'lib/charts';

export const Charts = async ({ organization }: { organization: string }) => {
  const { values, years, numberOfYears } =
    await getYearlyExpenseAggregation(organization);

  const transformedData = transformAggregateValues({
    values,
    years,
    numberOfYears,
  });

  return (
    <div className="grid xl:grid-cols-2">
      {transformedData.map((team) => (
        <div key={team.name}>
          <TypographyH4>{team.name}</TypographyH4>
          <div className="h-[60vh]">
            <BarStackChart
              key={team.name}
              data={team.values}
              domainKey="year"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
