'use server';

import { importedFiles } from '@planino/database/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from 'db/drizzle';

import { importer } from 'api/importer/client';

import { getOrganization } from './organization';

export const getPresignedUrls = async (names: string[]) => {
  const { data: r2Data, error } = await importer.POST('/import/presigned-url', {
    body: {
      names,
    },
  });

  if (error) {
    throw new Error(error);
  }

  return r2Data.urls;
};

export const saveFilesToDb = async ({
  names,
  organization,
}: {
  names: string[];
  organization: string;
}) => {
  const foundOrganization = await getOrganization(organization);

  const files = await db
    .insert(importedFiles)
    .values(
      names.map((name) => ({
        name,
        organizationId: foundOrganization.organizationId,
      })),
    )
    .onConflictDoNothing({
      target: importedFiles.name,
    })
    .returning();

  if (!files.length) {
    throw new Error('Neuspješno spremanje datoteka u bazu podataka');
  }

  revalidatePath('/[organization]/podatci/uvoz-podataka');

  return files;
};

export const getFiles = async (organization: string) => {
  const foundOrganization = await getOrganization(organization);

  const files = await db.query.importedFiles.findMany({
    where: eq(importedFiles.organizationId, foundOrganization.organizationId),
  });

  return files;
};
