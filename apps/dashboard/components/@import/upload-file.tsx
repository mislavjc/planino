'use client';

import { DropzoneOptions } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileBarChart, Paperclip } from 'lucide-react';
import { z } from 'zod';

import { getPresignedUrls } from 'actions/importer';

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

  const onSubmit = async (data: FormData) => {
    if (!data.files) return;

    const names = data.files.map(
      (file) => `${file.name}-${new Date().getTime()}`,
    );

    const urls = await getPresignedUrls(names);

    console.log(urls);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="files"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FileUploader
                value={field.value}
                onValueChange={field.onChange}
                dropzoneOptions={dropZoneConfig}
                className="relative rounded-lg p-2"
              >
                <FileInput className="outline-dashed outline-1 outline-white">
                  <div className="flex w-full flex-col items-center justify-center pb-4 pt-3 ">
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
                <FileUploaderContent>
                  {field.value &&
                    field.value.length > 0 &&
                    field.value.map((file, i) => (
                      <FileUploaderItem key={i} index={i}>
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
          className="h-8 w-fit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          Učitaj
        </Button>
      </form>
    </Form>
  );
};
