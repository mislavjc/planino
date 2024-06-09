import useSWR, { Fetcher } from 'swr';
import { z } from 'zod';

import { TransformedExpenseRecord } from 'lib/charts';

export const categoryTypeSchema = z.enum([
  'operational-expenses',
  'inventory',
  'teams',
  'loans',
]);

export type CategoryType = z.infer<typeof categoryTypeSchema>;

type FetcherResponse = {
  values: {
    name: string;
    values: TransformedExpenseRecord[];
  }[];
};

const fetcher: Fetcher<
  FetcherResponse,
  {
    organization: string;
    type: string;
  }
> = ({ organization, type }: { organization: string; type: string }) =>
  fetch(`/api/${organization}/graphs/${type}`).then((res) => res.json());

export const useChart = ({
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
