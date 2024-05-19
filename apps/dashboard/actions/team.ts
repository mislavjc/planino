'use server';

import { insertMemberSchema, members, teams } from '@planino/database/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { db } from 'db/drizzle';

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

export const createTeam = async (organization: string, name: string) => {
  const foundOrganization = await getOrganization(organization);

  const team = await db
    .insert(teams)
    .values({
      name,
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

  revalidatePath('/[organization]/imovina-i-oprema', 'page');
};
