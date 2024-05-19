import { getYearlyPayrollAggregation } from 'actions/team';

import { TeamYearlyTable } from 'components/table/team-yearly-table';

export const Overview = async ({ organization }: { organization: string }) => {
  const { values, years, numberOfYears } =
    await getYearlyPayrollAggregation(organization);

  return (
    <TeamYearlyTable
      values={values}
      years={years}
      numberOfYears={numberOfYears}
    />
  );
};
