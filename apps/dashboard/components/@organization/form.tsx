'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { createOrganization } from 'actions/organization';

import { APP_URL } from 'lib/constants';
import { slugify } from 'lib/utils';

import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

const formSchema = z.object({
  name: z.string().min(5, {
    message: 'Naziv organizacije mora imati bar 5 slova.',
  }),
});

export const OrganizationForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const slugifiedName = slugify(form.watch('name') ?? '');

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await createOrganization({
      name: data.name,
      slug: slugify(data.name),
    });

    if (response.error) {
      form.setError('name', {
        type: 'manual',
        message: response.error,
      });
    }

    if (response.organization) {
      form.reset();

      router.push(`/${slugifiedName}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Naziv poduzeća</FormLabel>
              <FormControl>
                <Input placeholder="Planino" {...field} />
              </FormControl>
              <FormDescription>
                Unesi naziv organizacije. Naziv mora imati bar 5 slova.
                {slugifiedName && (
                  <div className="text-muted-foreground">
                    Vaš link na organizaciju:{' '}
                    <b>
                      {APP_URL}/{slugifiedName}
                    </b>
                  </div>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Kreiraj organizaciju</Button>
      </form>
    </Form>
  );
};
