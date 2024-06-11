import { getMonthlyEarnings } from 'actions/output';

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

  const monthlyEarnings = await getMonthlyEarnings(organization);

  return Response.json(monthlyEarnings);
};
