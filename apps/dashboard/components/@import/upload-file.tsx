'use client';

import { DropzoneOptions } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileBarChart, Paperclip } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';

import { getPresignedUrls, revalidateTableCache } from 'actions/importer';

import { Button } from 'ui/button';
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from 'ui/file-upload';
import { Form, FormField, FormItem } from 'ui/form';

const formSchema = z.object({
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: 'File size must be less than 4MB',
      }),
    )
    .max(5, {
      message: 'Maximum 5 files are allowed',
    })
    .nullable(),
});

type FormData = z.infer<typeof formSchema>;

const dropZoneConfig = {
  maxFiles: 5,
  maxSize: 1024 * 1024 * 32,
  multiple: true,
} satisfies DropzoneOptions;

export const FileDropzone = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { organization } = useParams();

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    if (!data.files) return;

    const urls = await getPresignedUrls(
      data.files.map((file) => `${organization}/${file.name}`),
    );

    for (const [name, url] of Object.entries(urls)) {
      const file = data.files.find(
        (file) => file.name === name.split('/').pop(),
      );

      if (!file) continue;

      await fetch(url, {
        method: 'PUT',
        body: file,
      });
    }

    revalidateTableCache();

    await new Promise((resolve) => setTimeout(resolve, 500));

    router.push(`/${organization}/podatci/pregled`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          name="files"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FileUploader
                value={field.value}
                onValueChange={field.onChange}
                dropzoneOptions={dropZoneConfig}
                className="outline-border relative outline-dashed outline-2"
              >
                <FileInput>
                  <div className="flex w-full flex-col items-center justify-center p-8">
                    <FileBarChart />
                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Klikni</span>
                      &nbsp; ili povuci i pusti
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      XLS, XLSX
                    </p>
                  </div>
                </FileInput>
                <FileUploaderContent className="my-1 flex flex-col gap-1">
                  {field.value &&
                    field.value.length > 0 &&
                    field.value.map((file, i) => (
                      <FileUploaderItem key={i} index={i} className="border">
                        <Paperclip className="size-4 stroke-current" />
                        <span>{file.name}</span>
                      </FileUploaderItem>
                    ))}
                </FileUploaderContent>
              </FileUploader>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-fit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          Učitaj
        </Button>
      </form>
    </Form>
  );
};
