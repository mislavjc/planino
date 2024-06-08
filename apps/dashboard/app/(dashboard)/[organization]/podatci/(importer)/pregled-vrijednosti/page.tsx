import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getFilesWtihTables } from 'actions/importer';

import { Button } from 'ui/button';
import { Card, CardContent, CardHeader } from 'ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs';
import { TypographyH3 } from 'ui/typography';

import { ValueOverview } from 'components/@import/value-overview';

export const revalidate = 0;

const ValueOverviewPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const filesWithTables = await getFilesWtihTables(organization);

  if (!filesWithTables.length) {
    redirect(`/${organization}/podatci/uvoz-podataka`);
  }

  return (
    <div>
      <Card className="max-w-screen-xl">
        <CardHeader>
          <div className="flex justify-between">
            <TypographyH3>Pregled vrijednosti</TypographyH3>
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
                <div>
                  {file.importedTables.map((table) => (
                    <ValueOverview table={table} key={table.importedTableId} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValueOverviewPage;
