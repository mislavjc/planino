'use server';

import { openai } from '@ai-sdk/openai';
import { businessPlans } from '@planino/database/schema';
import { DeepPartial, streamObject } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

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

  if (!newPlan.length) {
    throw new Error('Neuspjelo kreiranje poslovnog plana');
  }

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
  });

  return dbPlan;
};

export const updateBusinessPlan = async ({
  businessPlanId,
  content,
  organization,
}: {
  businessPlanId: string;
  content: unknown;
  organization: string;
}) => {
  await getOrganization(organization);

  await db
    .update(businessPlans)
    .set({
      content: content,
    })
    .where(eq(businessPlans.businessPlanId, businessPlanId));

  revalidatePath('/[organization]/poslovni-planovi/[businessPlanId]', 'page');
};

const gradeSchema = z.object({
  grades: z.array(
    z.object({
      name: z.union([
        z.literal('Radno iskustvo'),
        z.literal('Obrazovanje ili dodatna edukacija'),
        z.literal('Prvo poduzetničko iskustvo'),
        z.literal('Popunjenost i sadržaj poslovnog plana'),
        z.literal('Indeks razvijenosti'),
        z.literal('Procjena prihoda i troškova'),
        z.literal('Dodatne prednosti i nedostatci'),
        z.literal('Inovativnost projekta'),
        z.literal('Ulaganje u nedovoljno razvijenu djelatnost'),
      ]),
      grade: z.number().int().min(0).max(15),
      max: z.number().int().min(0).max(15),
      feedback: z.string(),
      improvements: z.string(),
    }),
  ),
});

export type GradeBusinessPlan = z.infer<typeof gradeSchema>;
export type PartialGradeBusinessPlan = DeepPartial<typeof gradeSchema>;

export const gradeBusinessPlan = async ({ plan }: { plan: string }) => {
  const stream = createStreamableValue();

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai('gpt-4-turbo'),
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: `
        WRITE IN CROATIAN.

        You will receive a business plan and you need to rate it based on the following criteria:
        1. Work experience in the business plan activity (5-15 points)
        2. Education or additional training in the business plan activity (10-15 points)
        3. Previous entrepreneurial experience (5 points)
        4. HZZ workshop for self-employment (5 points)
        5. Completeness and content of the business plan with attached offers/pre-invoices (5-15 points)
        6. Development index of the local government unit where the business entity is based (0-10 points)
        7. Income and cost estimate (0-10 points)
        8. Additional advantages and disadvantages of the business plan (sustainability and competitiveness) (0-10 points)
        9. Project innovation (0-5 points)
        10. Investment in underdeveloped activity (0-5 points)
        
        For each section, provide a rating within the given range and detailed feedback.
        <BUSINESS_PLAN>${plan}</BUSINESS_PLAN>

        DO IT IN CROATIAN.
        `,
        },
        {
          role: 'user',
          content: `Please review the above business plan and rate each section based on the provided criteria, giving detailed feedback for each.`,
        },
      ],
      schema: gradeSchema,
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
};
