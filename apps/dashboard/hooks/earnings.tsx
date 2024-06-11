import useSWR, { Fetcher } from 'swr';

import { MonthlyEarnings } from 'actions/output';

type FetcherResponse = MonthlyEarnings;

const fetcher: Fetcher<
  FetcherResponse,
  {
    organization: string;
  }
> = ({ organization }: { organization: string }) =>
  fetch(`/api/${organization}/table/earnings`).then((res) => res.json());

export const useEarningsTable = ({
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
