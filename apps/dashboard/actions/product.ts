'use server';

import {
  insertProductPriceHistorySchema,
  productGroups,
  productPriceHistory,
  products,
} from '@planino/database/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { db } from 'db/drizzle';

import { toUpdateSchema } from 'lib/zod';

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
        orderBy: (products, { asc }) => [asc(products.createdAt)],
      },
    },
    orderBy: (productGroups, { asc }) => [asc(productGroups.createdAt)],
  });

  return foundProductGroups;
};

export const getProduct = async ({
  organization,
  productId,
}: {
  organization: string;
  productId: string;
}) => {
  await getOrganization(organization);

  const foundProduct = await db.query.products.findFirst({
    where: eq(products.productId, productId),
    with: {
      priceHistory: {
        orderBy: (productPriceHistory, { asc }) => [
          asc(productPriceHistory.recordedMonth),
        ],
      },
    },
  });

  return foundProduct;
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

  revalidatePath('/[organization]/cijena-i-kolicina', 'page');
};

const updateProductPriceHistorySchema = toUpdateSchema(
  insertProductPriceHistorySchema,
);

type UpdateProductPriceHistory = z.infer<
  typeof updateProductPriceHistorySchema
>;

export const updateProductPriceHistory = async (
  payload: UpdateProductPriceHistory,
) => {
  const parsedPayload = updateProductPriceHistorySchema.parse(payload);

  if (!parsedPayload.productPriceId) {
    return {
      error: 'ID Cijene proizvoda je potreban.',
    };
  }

  const updatedProductPriceHistory = await db
    .update(productPriceHistory)
    .set(parsedPayload)
    .where(eq(productPriceHistory.productPriceId, parsedPayload.productPriceId))
    .returning();

  if (!updatedProductPriceHistory.length) {
    throw new Error('Neuspjelo ažuriranje povijesti cijena proizvoda');
  }

  revalidatePath('/[organization]/cijena-i-kolicina', 'page');
};

const deleteProductPriceHistorySchema = z.object({
  productPriceId: z.string(),
});

export const deleteProductPriceHistory = async (formData: FormData) => {
  const parsedFormData = deleteProductPriceHistorySchema.parse({
    productPriceId: formData.get('productPriceId'),
  });

  const deletedProductPriceHistory = await db
    .delete(productPriceHistory)
    .where(
      eq(productPriceHistory.productPriceId, parsedFormData.productPriceId),
    )
    .returning();

  if (!deletedProductPriceHistory.length) {
    throw new Error('Neuspjelo brisanje povijesti cijena proizvoda');
  }

  revalidatePath('/[organization]/cijena-i-kolicina', 'page');
};

export const updateProduct = async (
  productId: string,
  {
    name,
    unitType,
  }: {
    name: string;
    unitType: string;
  },
) => {
  const updatedProduct = await db
    .update(products)
    .set({ name, unitType })
    .where(eq(products.productId, productId))
    .returning();

  if (!updatedProduct.length) {
    throw new Error('Neuspjelo ažuriranje naziva proizvoda');
  }

  revalidatePath('/[organization]/cijena-i-kolicina', 'page');
};

export const createProductGroup = async ({
  organization,
}: {
  organization: string;
}) => {
  const foundOrganization = await getOrganization(organization);

  const createdProductGroup = await db
    .insert(productGroups)
    .values({
      organizationId: foundOrganization.organizationId,
    })
    .returning();

  if (!createdProductGroup) {
    throw new Error('Neuspjelo kreiranje grupe proizvoda');
  }

  revalidatePath('/[organization]/cijena-i-kolicina', 'page');
};

export const updateProductGroup = async ({
  productGroupId,
  name,
}: {
  productGroupId: string;
  name: string;
}) => {
  const updatedProductGroup = await db
    .update(productGroups)
    .set({ name })
    .where(eq(productGroups.productGroupId, productGroupId))
    .returning();

  if (!updatedProductGroup.length) {
    throw new Error('Neuspjelo ažuriranje naziva grupe proizvoda');
  }

  revalidatePath('/[organization]/cijena-i-kolicina', 'page');
};

export const getProductAggregations = async ({
  organization,
  productId,
}: {
  organization: string;
  productId: string;
}) => {
  await getOrganization(organization);

  const foundProduct = await db
    .select({
      month: sql<string>`to_char(recorded_month, 'YYYY-MM')`.as('month'),
      'Ukupno zarađeno':
        sql<string>`${productPriceHistory.unitCount} * (${productPriceHistory.unitPrice} - ${productPriceHistory.unitExpense})`.as(
          'totalValue',
        ),
    })
    .from(products)
    .innerJoin(
      productPriceHistory,
      eq(products.productId, productPriceHistory.productId),
    )
    .where(eq(products.productId, productId))
    .orderBy(sql`month ASC`);

  return foundProduct;
};
