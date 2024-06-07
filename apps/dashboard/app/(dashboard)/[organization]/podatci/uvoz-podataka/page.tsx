import { getFiles } from 'actions/importer';

import { Card, CardContent, CardHeader } from 'ui/card';
import { TypographyH3 } from 'ui/typography';

import { FileDropzone } from 'components/@import/upload-file';

const DataImportPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const files = await getFiles(organization);

  return (
    <div className="flex flex-col gap-4">
      <Card className="max-w-screen-sm">
        <CardHeader>
          <TypographyH3>Uvoz podataka</TypographyH3>
        </CardHeader>
        <CardContent>
          <FileDropzone />
        </CardContent>
      </Card>
      <Card className="max-w-screen-sm">
        <CardHeader>
          <TypographyH3>Pregled uvezenih podataka</TypographyH3>
        </CardHeader>
        <CardContent>
          <ul>
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataImportPage;
