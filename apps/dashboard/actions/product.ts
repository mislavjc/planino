'use server';

import {
  insertProductPriceHistorySchema,
  productGroups,
  productPriceHistory,
  products,
} from '@planino/database/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from 'db/drizzle';

import { getOrganization } from './organization';

export const getAllProducts = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const foundProductGroups = await db.query.productGroups.findMany({
    where: eq(productGroups.organizationId, foundOrganization.organizationId),
    with: {
      products: {
        with: {
          priceHistory: true,
        },
      },
    },
  });

  return foundProductGroups;
};

export const createProduct = async ({
  organization,
  group,
}: {
  organization: string;
  group: string;
}) => {
  await getOrganization(organization);

  const createdProduct = await db
    .insert(products)
    .values({
      productGroupId: group,
    })
    .returning();

  if (!createdProduct) {
    throw new Error('Neuspjelo kreiranje proizvoda');
  }

  const createdProductHistory = await db
    .insert(productPriceHistory)
    .values({
      productId: createdProduct[0].productId,
      recordedMonth: new Date(),
    })
    .returning();

  if (!createdProductHistory) {
    throw new Error('Neuspjelo kreiranje povijesti cijena proizvoda');
  }

  revalidatePath('/[organization]/cijena-i-kolicina', 'page');
};

export const createProductPriceHistory = async (formData: FormData) => {
  const parsedFormData = insertProductPriceHistorySchema.parse({
    productId: formData.get('productId'),
    recordedMonth: new Date(formData.get('recordedMonth') as string),
  });

  const createdProductHistory = await db
    .insert(productPriceHistory)
    .values({
      productId: parsedFormData.productId,
      recordedMonth: parsedFormData.recordedMonth,
    })
    .returning();

  if (!createdProductHistory) {
    throw new Error('Neuspjelo kreiranje povijesti cijena proizvoda');
  }

  revalidatePath('/[organization]/cijena-i-kolicina');
};
