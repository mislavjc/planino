import { redirect } from 'next/navigation';

import { Card, CardContent, CardHeader } from 'ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs';
import { TypographyH3 } from 'ui/typography';

import { ColumnMapping } from 'components/@import/column-mapping';

import { importer } from 'api/importer/client';

export const revalidate = 0;

const ColumnMappingPage = async ({
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
          <TypographyH3>Pregled uvezenih podataka</TypographyH3>
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
                <ColumnMapping file={file.key} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColumnMappingPage;
