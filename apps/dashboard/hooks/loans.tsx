import useSWR, { Fetcher } from 'swr';

type FetcherResponse = {
  loans: {
    loanId: string;
    name: string | null;
    interestRate: string | null;
    duration: number | null;
    startingYear: number;
    endingYear: number;
    amount: string | null;
  }[];
};

const fetcher: Fetcher<
  FetcherResponse,
  {
    organization: string;
  }
> = ({ organization }: { organization: string }) =>
  fetch(`/api/${organization}/table/loans`).then((res) => res.json());

export const useLoansTable = ({ organization }: { organization: string }) => {
  const { data } = useSWR(
    {
      organization: organization as string,
    },
    fetcher,
  );

  return data;
};
