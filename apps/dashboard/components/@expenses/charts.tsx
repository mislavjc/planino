import { BarChart } from '@planino/charts';

import { getYearlyExpenseAggregation } from 'actions/expense';

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
          <BarChart
            key={team.name}
            data={team.values}
            className="h-[50vh]"
            index="year"
            type="stacked"
            categories={
              team.values.length > 0
                ? Object.keys(team.values[0]).filter((key) => key !== 'year')
                : []
            }
          />
        </div>
      ))}
    </div>
  );
};
