'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { z } from 'zod';

import { Button } from 'ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from 'ui/form';
import { Input } from 'ui/input';
import { TypographyP } from 'ui/typography';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Naziv odjela mora imati bar 3 slova.',
  }),
});

export const TeamsForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        className="flex max-w-lg flex-col gap-2 border p-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel htmlFor="name">Naziv odjela</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Marketing"
                  id="name"
                  className="w-full"
                />
              </FormControl>
              {fieldState.error && (
                <TypographyP className="text-sm text-red-500">
                  {fieldState.error.message}
                </TypographyP>
              )}
            </FormItem>
          )}
        />
        <Button className="flex w-min gap-2">
          <Plus size={16} />
          Dodaj odjel
        </Button>
      </form>
    </Form>
  );
};
