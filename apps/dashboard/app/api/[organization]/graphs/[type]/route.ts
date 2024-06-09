import { getYearlyExpenseAggregation } from 'actions/expense';
import { getInventoryValues } from 'actions/inventory';
import { getLoansForCalulation } from 'actions/loan';
import { getYearlyPayrollAggregation } from 'actions/team';

import { CategoryType, categoryTypeSchema } from 'hooks/charts';

import { transformAggregateValues } from 'lib/charts';
import { getLoanPaymentData } from 'lib/loans';

const fetchDataByType = async (type: CategoryType, organization: string) => {
  switch (type) {
    case 'operational-expenses':
      const yearlyExpenses = await getYearlyExpenseAggregation(organization);

      return transformAggregateValues(yearlyExpenses);
    case 'inventory':
      const inventory = await getInventoryValues(organization);

      return transformAggregateValues(inventory);
    case 'teams':
      const teams = await getYearlyPayrollAggregation(organization);

      return transformAggregateValues(teams);
    case 'loans':
      const loans = await getLoansForCalulation(organization);

      return getLoanPaymentData(loans);
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

  return Response.json({
    values: data,
  });
};
