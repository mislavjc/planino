import React from 'react';

import { getInventoryValues } from 'actions/inventory';

import { TeamYearlyTable } from 'components/table/team-yearly-table';

export const Overview = async ({ organization }: { organization: string }) => {
  const { values, years, numberOfYears } =
    await getInventoryValues(organization);

  return (
    <TeamYearlyTable
      values={values}
      years={years}
      numberOfYears={numberOfYears}
    />
  );
};
