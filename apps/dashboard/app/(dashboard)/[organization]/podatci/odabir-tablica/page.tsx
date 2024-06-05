import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Card, CardContent, CardHeader } from 'ui/card';
import { ScrollArea } from 'ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs';
import { TypographyH3 } from 'ui/typography';

import { ExcelTable } from 'components/@import/excel-table';
import { Button } from 'components/ui/button';

import { importer } from 'api/importer/client';

export const revalidate = 0;

const DataOverviewPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const { data, error } = await importer.GET('/import/{organization}/files', {
    params: {
      path: {
        organization,
      },
    },
  });

  if (error) {
    throw new Error(error);
  }

  if (!data.objects.length) {
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
          <Tabs defaultValue={data?.objects[0].key}>
            <TabsList>
              {data?.objects.map((file) => (
                <TabsTrigger key={file.key} value={file.key}>
                  {file.key}
                </TabsTrigger>
              ))}
            </TabsList>
            {data?.objects.map((file) => (
              <TabsContent
                className="max-h-[80vh] max-w-screen-xl overflow-auto"
                key={file.key}
                value={file.key}
              >
                <ScrollArea className="w-max">
                  <Suspense>
                    <ExcelTable file={file.key} />
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
