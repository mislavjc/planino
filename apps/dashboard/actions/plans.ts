'use server';

import { businessPlans } from '@planino/database/schema';
import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import { db } from 'db/drizzle';

import { getOrganization } from './organization';

export const getBusinessPlans = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const dbPlans = await db
    .select()
    .from(businessPlans)
    .where(eq(businessPlans.organizationId, foundOrganization.organizationId));

  return dbPlans;
};

export const createBusinessPlan = async (formData: FormData) => {
  const organization = formData.get('organization') as string;

  const foundOrganization = await getOrganization(organization);

  const newPlan = await db
    .insert(businessPlans)
    .values({
      organizationId: foundOrganization.organizationId,
    })
    .returning();

  redirect(`/${organization}/poslovni-planovi/${newPlan[0].businessPlanId}`);
};

export const getBusinessPlan = async ({
  organization,
  businessPlanId,
}: {
  organization: string;
  businessPlanId: string;
}) => {
  const foundOrganization = await getOrganization(organization);

  const dbPlan = await db.query.businessPlans.findFirst({
    where: and(
      eq(businessPlans.organizationId, foundOrganization.organizationId),
      eq(businessPlans.businessPlanId, businessPlanId),
    ),
    with: {
      blocks: true,
    },
  });

  return dbPlan;
};
