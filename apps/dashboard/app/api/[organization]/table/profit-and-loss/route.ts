import { getMonthlyAggregateCostsAndSales } from 'actions/output';

export const GET = async (
  _request: Request,
  {
    params,
  }: {
    params: {
      organization: string;
    };
  },
) => {
  const { organization } = params;

  const profitAndLoss = await getMonthlyAggregateCostsAndSales(organization);

  return Response.json(profitAndLoss);
};
