'use server';

import {
  insertOrganzationSchema,
  organizations,
  organizationUsers,
  users,
} from '@planino/database/schema';
import { auth } from 'auth';
import { and, eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

import { db } from 'db/drizzle';

import { UpdateOrganization } from 'components/@organization/settings-form';

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
    })
    .onConflictDoNothing()
    .returning();

  if (!organization.length) {
    return {
      error: 'Organizacija već postoji.',
    };
  }

  await db.insert(organizationUsers).values({
    organizationId: organization[0].organizationId,
    userId: session.user.id,
  });

  return {
    organization: organization[0],
  };
};

export const updateOrganization = async (
  organization_id: string,
  data: UpdateOrganization,
) => {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    throw new Error('Unauthorized');
  }

  const organization = await db.query.organizations.findFirst({
    where: eq(organizations.organizationId, organization_id),
  });

  if (!organization) {
    throw new Error('Organizacija nije pronađena.');
  }

  try {
    await db
      .update(organizations)
      .set(data)
      .where(eq(organizations.organizationId, organization.organizationId))
      .execute();
  } catch (error) {
    throw new Error('Neuspjelo ažuriranje organizacije.');
  }
};

export const getOrganization = async (slug: string) => {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    redirect('/prijava');
  }

  const organization = await db
    .select({
      organizationId: organizations.organizationId,
      name: organizations.name,
      slug: organizations.slug,
      industry: organizations.industry,
      personalIdentificationNumber: organizations.personalIdentificationNumber,
      createdAt: organizations.createdAt,
      street_address: organizations.street_address,
      city: organizations.city,
      country: organizations.country,
    })
    .from(organizations)
    .innerJoin(
      organizationUsers,
      eq(organizationUsers.organizationId, organizations.organizationId),
    )
    .where(
      and(
        eq(organizations.slug, slug),
        eq(organizationUsers.userId, session.user.id),
      ),
    );

  if (!organization.length) {
    notFound();
  }

  return organization[0];
};

export const getOrganizationUsers = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const foundUsers = await db
    .select({
      id: users.id,
      email: users.email,
      emailVerified: users.emailVerified,
      image: users.image,
    })
    .from(users)
    .innerJoin(organizationUsers, eq(organizationUsers.userId, users.id))
    .where(
      eq(organizationUsers.organizationId, foundOrganization.organizationId),
    );

  return foundUsers;
};
