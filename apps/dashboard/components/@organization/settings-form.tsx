'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  insertOrganzationSchema,
  SelectOrganization,
} from '@planino/database/schema';
import { z } from 'zod';

import { updateOrganization } from 'actions/organization';

import { Button } from 'ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'ui/form';
import { Input } from 'ui/input';

import { toUpdateSchema } from 'lib/zod';

const updateOrganizationSchema = toUpdateSchema(insertOrganzationSchema);

export type UpdateOrganization = z.infer<typeof updateOrganizationSchema>;

export const SettingsFrom = ({
  organization,
}: {
  organization: SelectOrganization;
}) => {
  const form = useForm<UpdateOrganization>({
    resolver: zodResolver(updateOrganizationSchema),
    values: organization,
  });

  const onSubmit = async (data: UpdateOrganization) => {
    await updateOrganization(organization.organizationId, data);
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personalIdentificationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OIB</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Djelatnost</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ulica i kućni broj</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-2 md:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grad</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Država</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Spremi promjene</Button>
      </form>
    </Form>
  );
};
