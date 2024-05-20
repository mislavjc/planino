import { z } from 'zod';

import { db } from 'db/drizzle';
import { YEARLY_AGGREGATE_TEAM_EXPENSES } from 'db/queries';

import { getOrganization } from './organization';

const yearlyAggregationSchema = z.array(
  z.object({
    team_name: z.string().nullable(),
    values: z.array(
      z
        .object({
          year: z.coerce.string(),
        })
        .catchall(z.coerce.string()),
    ),
  }),
);

export const getExpensesPerTeam = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const result = (
    await db.execute(
      YEARLY_AGGREGATE_TEAM_EXPENSES(foundOrganization.organizationId),
    )
  ).rows;

  const yearlyAggregations = yearlyAggregationSchema.parse(result);

  return yearlyAggregations;
};
