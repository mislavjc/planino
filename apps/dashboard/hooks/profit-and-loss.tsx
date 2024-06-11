import useSWR, { Fetcher } from 'swr';

import { MonthlyAggregateFixedCosts } from 'actions/output';

type FetcherResponse = MonthlyAggregateFixedCosts;

const fetcher: Fetcher<
  FetcherResponse,
  {
    organization: string;
  }
> = ({ organization }: { organization: string }) =>
  fetch(`/api/${organization}/table/profit-and-loss`).then((res) => res.json());

export const useProfitLossTable = ({
  organization,
}: {
  organization: string;
}) => {
  const { data } = useSWR(
    {
      organization: organization as string,
    },
    fetcher,
  );

  return data;
};
