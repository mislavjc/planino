import useSWR, { Fetcher } from 'swr';

import { CategoryType } from './charts';

type FetcherResponse = {
  values: {
    team_name: string;
    item_name: string;
    yearly_values: (number | null)[];
  }[];
  years: string[];
  numberOfYears: number;
};

const fetcher: Fetcher<
  FetcherResponse,
  {
    organization: string;
    type: string;
  }
> = ({ organization, type }: { organization: string; type: string }) =>
  fetch(`/api/${organization}/table/${type}`).then((res) => res.json());

export const useTable = ({
  organization,
  type,
}: {
  organization: string;
  type: CategoryType;
}) => {
  const { data } = useSWR(
    {
      organization: organization as string,
      type: type,
    },
    fetcher,
  );

  return data;
};
