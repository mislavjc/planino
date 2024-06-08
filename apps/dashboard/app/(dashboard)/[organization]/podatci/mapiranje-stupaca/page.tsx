import { importedFiles } from '@planino/database/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { db } from 'db/drizzle';

import { getOrganization } from 'actions/organization';

import { Button } from 'ui/button';
import { Card, CardContent, CardHeader } from 'ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs';
import { TypographyH3 } from 'ui/typography';

import { ColumnMapping } from 'components/@import/column-mapping';

export const revalidate = 0;

const ColumnMappingPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const foundOrganization = await getOrganization(organization);

  const filesWithTables = await db.query.importedFiles.findMany({
    where: eq(importedFiles.organizationId, foundOrganization.organizationId),
    with: {
      importedTables: true,
    },
  });

  if (!filesWithTables.length) {
    redirect(`/${organization}/podatci/uvoz-podataka`);
  }

  return (
    <div>
      <Card className="max-w-screen-xl">
        <CardHeader>
          <div className="flex justify-between">
            <TypographyH3>Mapiranje stupaca</TypographyH3>
            <div className="flex gap-4">
              <Link href={`/${organization}/podatci/odabir-tablica`}>
                <Button variant="secondary">Nazad</Button>
              </Link>
              <Link href={`/${organization}/podatci/pregled-vrijednosti`}>
                <Button>Nastavi</Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={filesWithTables[0].name}>
            <TabsList>
              {filesWithTables.map((file) => (
                <TabsTrigger key={file.name} value={file.name}>
                  {file.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {filesWithTables.map((file) => (
              <TabsContent
                className="max-w-screen-xl overflow-auto"
                key={file.name}
                value={file.name}
              >
                <ColumnMapping file={file} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColumnMappingPage;
