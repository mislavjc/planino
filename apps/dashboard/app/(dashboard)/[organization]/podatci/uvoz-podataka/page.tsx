import { Card, CardContent, CardHeader } from 'ui/card';

import { FileDropzone } from 'components/@import/upload-file';
import { TypographyH3 } from 'components/ui/typography';

const DataImportPage = () => {
  return (
    <Card className="max-w-screen-sm">
      <CardHeader>
        <TypographyH3>Uvoz podataka</TypographyH3>
      </CardHeader>
      <CardContent>
        <FileDropzone />
      </CardContent>
    </Card>
  );
};

export default DataImportPage;
