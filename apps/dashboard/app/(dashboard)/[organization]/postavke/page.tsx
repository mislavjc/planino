import { UserRoundPlus } from 'lucide-react';

import { getOrganization, getOrganizationUsers } from 'actions/organization';

import { Button } from 'ui/button';
import { Card, CardContent, CardHeader } from 'ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/table';
import { TypographyH3 } from 'ui/typography';

import { SettingsFrom } from 'components/@organization/settings-form';

const SettingsPage = async ({
  params: { organization },
}: {
  params: {
    organization: string;
  };
}) => {
  const foundOrganization = await getOrganization(organization);

  const organizationUsers = await getOrganizationUsers(organization);

  return (
    <div>
      <Card className="max-w-screen-sm">
        <CardHeader>
          <TypographyH3>Postavke organizacije</TypographyH3>
        </CardHeader>
        <CardContent>
          <SettingsFrom organization={foundOrganization} />
        </CardContent>
      </Card>
      <Card className="mt-4 max-w-screen-sm">
        <CardHeader>
          <TypographyH3>Korisnici organizacije</TypographyH3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Ime</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizationUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>
                  <Button className="w-full" variant="ghost">
                    <div className="flex gap-2">
                      <UserRoundPlus className="size-4" />
                      Dodaj korisnika
                    </div>
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
