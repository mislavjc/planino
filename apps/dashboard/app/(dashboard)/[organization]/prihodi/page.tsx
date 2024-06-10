import { getMonthlyEarnings } from 'actions/output';

const EarningsPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const earnings = await getMonthlyEarnings(organization);

  return <div>{JSON.stringify(earnings)}</div>;
};

export default EarningsPage;
