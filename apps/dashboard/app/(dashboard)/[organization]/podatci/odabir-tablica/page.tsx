import { Suspense } from 'react';
import { importedFiles } from '@planino/database/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { db } from 'db/drizzle';

import { getOrganization } from 'actions/organization';

import { Card, CardContent, CardHeader } from 'ui/card';
import { ScrollArea } from 'ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs';
import { TypographyH3 } from 'ui/typography';

import { ExcelTable } from 'components/@import/excel-table';
import { Button } from 'components/ui/button';

export const revalidate = 0;

const DataOverviewPage = async ({
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
            <TypographyH3>Pregled uvezenih podataka</TypographyH3>
            <div className="flex gap-4">
              <Link href={`/${organization}/podatci/uvoz-podataka`}>
                <Button variant="secondary">Nazad</Button>
              </Link>
              <Link href={`/${organization}/podatci/mapiranje-stupaca`}>
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
                className="max-h-[80vh] max-w-screen-xl overflow-auto"
                key={file.name}
                value={file.name}
              >
                <ScrollArea className="w-max">
                  <Suspense>
                    <ExcelTable file={file} />
                  </Suspense>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataOverviewPage;
