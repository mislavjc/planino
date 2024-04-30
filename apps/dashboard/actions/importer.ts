'use server';

import { revalidatePath } from 'next/cache';

import { importer } from 'api/importer/client';

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

export const revalidateTableCache = async () => {
  revalidatePath('/[organization]/podatci/pregled');
};
