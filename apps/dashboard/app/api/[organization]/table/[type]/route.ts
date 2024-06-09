import { getYearlyExpenseAggregation } from 'actions/expense';
import { getInventoryValues } from 'actions/inventory';
import { getYearlyPayrollAggregation } from 'actions/team';

import { CategoryType, categoryTypeSchema } from 'hooks/charts';

const fetchDataByType = async (type: CategoryType, organization: string) => {
  switch (type) {
    case 'operational-expenses':
      return await getYearlyExpenseAggregation(organization);
    case 'inventory':
      return await getInventoryValues(organization);
    case 'teams':
      return await getYearlyPayrollAggregation(organization);
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

  const data = await fetchDataByType(parsedType, organization);

  return Response.json(data);
};
