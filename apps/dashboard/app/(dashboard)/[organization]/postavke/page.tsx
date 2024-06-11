import { getOrganization } from 'actions/organization';

import { Card, CardContent, CardHeader } from 'ui/card';
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
    </div>
  );
};

export default SettingsPage;
