import { z } from 'zod';

import { db } from 'db/drizzle';
import {
  YEARLY_AGGREGATE_EXPENSES,
  YEARLY_AGGREGATE_TEAM_EXPENSES,
} from 'db/queries';

import { getOrganization } from './organization';

const yearlyValuesSchema = z.array(
  z
    .object({
      year: z.coerce.string(),
    })
    .catchall(z.coerce.string()),
);

const yearlyTeamAggregationSchema = z.array(
  z.object({
    team_name: z.string().nullable(),
    values: yearlyValuesSchema,
  }),
);

const yearlyAggregationSchema = z.array(
  z.object({
    values: yearlyValuesSchema,
  }),
);

export const getExpensesPerTeam = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const result = (
    await db.execute(
      YEARLY_AGGREGATE_TEAM_EXPENSES(foundOrganization.organizationId),
    )
  ).rows;

  const yearlyAggregations = yearlyTeamAggregationSchema.parse(result);

  if (!yearlyAggregations.length) {
    return [];
  }

  return yearlyAggregations;
};

export const getExpenses = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const result = (
    await db.execute(
      YEARLY_AGGREGATE_EXPENSES(foundOrganization.organizationId),
    )
  ).rows;

  const yearlyAggregations = yearlyAggregationSchema.parse(result);

  if (!yearlyAggregations.length) {
    return [
      {
        values: [],
      },
    ];
  }

  return yearlyAggregations;
};