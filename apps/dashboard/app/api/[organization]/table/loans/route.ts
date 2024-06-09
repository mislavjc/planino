import { getLoansForCalulation } from 'actions/loan';

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

  const loansForCalculation = await getLoansForCalulation(organization);

  return Response.json({
    loans: loansForCalculation,
  });
};
