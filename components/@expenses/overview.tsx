import React from 'react';

import { getYearlyExpenseAggregation } from 'actions/expense';

import { TeamYearlyTable } from 'components/table/team-yearly-table';

export const Overview = async ({ organization }: { organization: string }) => {
  const { values, years, numberOfYears } =
    await getYearlyExpenseAggregation(organization);

  return (
    <TeamYearlyTable
      values={values}
      years={years}
      numberOfYears={numberOfYears}
    />
  );
};
