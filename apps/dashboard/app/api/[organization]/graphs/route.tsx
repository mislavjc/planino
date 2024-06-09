import { getYearlyExpenseAggregation } from 'actions/expense';

import { transformAggregateValues } from 'lib/charts';

export const GET = async (
  request: Request,
  {
    params,
  }: {
    params: {
      organization: string;
    };
  },
) => {
  const { organization } = params;

  const { values, years, numberOfYears } =
    await getYearlyExpenseAggregation(organization);

  const transformedData = transformAggregateValues({
    values,
    years,
    numberOfYears,
  });

  return Response.json({
    values: transformedData,
  });
};
