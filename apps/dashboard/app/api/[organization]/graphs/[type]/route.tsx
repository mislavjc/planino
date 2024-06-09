import { getYearlyExpenseAggregation } from 'actions/expense';
import { getInventoryValues } from 'actions/inventory';

import { CategoryType, categoryTypeSchema } from 'hooks/charts';

import { transformAggregateValues } from 'lib/charts';

const fetchDataByType = async (type: CategoryType, organization: string) => {
  switch (type) {
    case 'yearly-expense':
      return await getYearlyExpenseAggregation(organization);
    case 'inventory':
      return await getInventoryValues(organization);
    default:
      throw new Error('Invalid data type');
  }
};

export const GET = async (
  _request: Request,
  {
    params,
  }: {
    params: {
      organization: string;
      type: string;
    };
  },
) => {
  const { organization, type } = params;

  const parsedType = categoryTypeSchema.parse(type);

  const { values, years, numberOfYears } = await fetchDataByType(
    parsedType,
    organization,
  );

  const transformedData = transformAggregateValues({
    values,
    years,
    numberOfYears,
  });

  return Response.json({
    values: transformedData,
  });
};
