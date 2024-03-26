'use server';

import { auth } from 'auth';
import { db } from 'db/drizzle';
import { insertOrganzationSchema, organizations } from 'db/schema';
import { z } from 'zod';

type OrganizationInsertInput = Omit<
  z.infer<typeof insertOrganzationSchema>,
  'userId'
>;

export const createOrganization = async (data: OrganizationInsertInput) => {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    throw new Error('Unauthorized');
  }

  const organization = await db
    .insert(organizations)
    .values({
      ...data,
      userId: session.user.id,
    })
    .onConflictDoNothing()
    .returning();

  if (!organization.length) {
    return {
      error: 'Organizacija već postoji.',
    };
  }

  return {
    organization: organization[0],
  };
};
