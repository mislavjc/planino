'use server';

import { teams } from '@planino/database/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from 'db/drizzle';

import { getOrganization } from './organization';

export const getTeams = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const foundTeams = await db.query.teams.findMany({
    where: eq(teams.organizationId, foundOrganization.organizationId),
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