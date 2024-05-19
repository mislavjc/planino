'use server';

import { insertMemberSchema, members, teams } from '@planino/database/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { db } from 'db/drizzle';
import { YEARLY_SALARY_AGREGATION } from 'db/queries';

import { toUpdateSchema } from 'lib/zod';

import { getOrganization } from './organization';

export const getTeams = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const foundTeams = await db.query.teams.findMany({
    where: eq(teams.organizationId, foundOrganization.organizationId),
    with: {
      members: {
        orderBy: (members, { asc }) => [asc(members.createdAt)],
      },
    },
    orderBy: (teams, { asc }) => [asc(teams.createdAt)],
  });

  return foundTeams;
};

export const createTeam = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const team = await db
    .insert(teams)
    .values({
      organizationId: foundOrganization.organizationId,
    })
    .returning();

  if (!team.length) {
    return {
      error: 'Odjel već postoji.',
    };
  }

  revalidatePath('/[organization]/odjeli', 'page');

  return {
    team: team[0],
  };
};

export const updateTeamName = async ({
  teamId,
  name,
}: {
  teamId: string;
  name: string;
}) => {
  await db
    .update(teams)
    .set({
      name,
    })
    .where(eq(teams.teamId, teamId));

  revalidatePath('/[organization]/odjeli', 'page');
};

export const createMember = async ({
  organization,
  teamId,
}: {
  organization: string;
  teamId: string;
}) => {
  await getOrganization(organization);

  const member = await db
    .insert(members)
    .values({
      teamId,
    })
    .returning();

  revalidatePath('/[organization]/odjeli', 'page');

  return {
    member: member[0],
  };
};

const updateMemberSchema = toUpdateSchema(insertMemberSchema);

type UpdateMember = z.infer<typeof updateMemberSchema>;

export const updateMember = async (payload: UpdateMember) => {
  const parsedPayload = updateMemberSchema.parse(payload);

  if (!parsedPayload.memberId) {
    throw new Error('Nedostaje identifikator člana.');
  }

  await db
    .update(members)
    .set(parsedPayload)
    .where(eq(members.memberId, parsedPayload.memberId));

  revalidatePath('/[organization]/odjeli', 'page');
};

export const deleteMember = async (memberId: string) => {
  await db.delete(members).where(eq(members.memberId, memberId));

  revalidatePath('/[organization]/odjeli', 'page');
};

export const clearMember = async (memberId: string) => {
  await db
    .update(members)
    .set({
      name: '',
      role: '',
      salary: null,
      raisePercentage: null,
      startingMonth: null,
      endingMonth: null,
    })
    .where(eq(members.memberId, memberId));

  revalidatePath('/[organization]/odjeli', 'page');
};

export const duplicateMember = async (memberId: string) => {
  const member = await db.query.members.findFirst({
    where: eq(members.memberId, memberId),
  });

  if (!member) {
    throw new Error('Član nije pronađen.');
  }

  const newMember = await db
    .insert(members)
    .values({
      teamId: member.teamId,
      name: member.name,
      role: member.role,
      salary: member.salary,
      raisePercentage: member.raisePercentage,
      startingMonth: member.startingMonth,
      endingMonth: member.endingMonth,
    })
    .returning();

  revalidatePath('/[organization]/odjeli', 'page');

  return {
    member: newMember[0],
  };
};

const yearlyPayrollAggregationSchema = z.array(
  z.object({
    team_name: z.string(),
    item_name: z.string(),
    yearly_values: z.array(z.number().nullable()),
  }),
);

export const getYearlyPayrollAggregation = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const ressult = (
    await db.execute(YEARLY_SALARY_AGREGATION(foundOrganization.organizationId))
  ).rows;

  const startYear = await db
    .select({
      startYear: sql<string>`EXTRACT(YEAR FROM member.starting_month)`,
    })
    .from(members)
    .innerJoin(teams, eq(teams.teamId, members.teamId))
    .where(eq(teams.organizationId, foundOrganization.organizationId))
    .orderBy(members.startingMonth)
    .limit(1);

  const parsedResult = yearlyPayrollAggregationSchema.parse(ressult);

  if (!parsedResult.length) {
    return {
      values: [],
      years: [],
      numberOfYears: 0,
    };
  }

  const numberOfYears = parsedResult[0].yearly_values.length;

  const years = Array.from({ length: numberOfYears }, (_, i) => {
    return String(Number(startYear[0].startYear) + i);
  });

  return {
    values: parsedResult,
    years,
    numberOfYears,
  };
};
