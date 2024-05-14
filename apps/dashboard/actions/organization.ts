'use server';

import {
  insertOrganzationSchema,
  organizations,
} from '@planino/database/schema';
import { auth } from 'auth';
import { and, eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

import { db } from 'db/drizzle';

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

export const getOrganization = async (slug: string) => {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    redirect('/login');
  }

  const organization = await db.query.organizations.findFirst({
    where: and(
      eq(organizations.slug, slug),
      eq(organizations.userId, session.user.id),
    ),
    columns: {
      name: true,
      organizationId: true,
    },
  });

  if (!organization) {
    notFound();
  }

  return organization;
};
