import useSWR, { Fetcher } from 'swr';

import { MonthlyEarnings } from 'actions/output';

type FetcherResponse = MonthlyEarnings;

const fetcher: Fetcher<
  FetcherResponse,
  {
    organization: string;
  }
> = ({ organization }: { organization: string }) =>
  fetch(`/api/${organization}/earnings`).then((res) => res.json());

export const useEarnings = ({ organization }: { organization: string }) => {
  const { data } = useSWR(
    {
      organization: organization as string,
    },
    fetcher,
  );

  return data;
};
