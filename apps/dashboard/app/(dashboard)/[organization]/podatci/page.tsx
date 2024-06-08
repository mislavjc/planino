import Link from 'next/link';

import { Card, CardContent, CardHeader } from 'ui/card';
import { TypographyH3, TypographyH4 } from 'ui/typography';

const DataPAge = ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Uvoz podataka</TypographyH3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="grid grid-cols-2 gap-4">
            {['Excel datoteke', 'Minimax-a'].map((source) => (
              <Link
                className="border p-4"
                key={source}
                href={`/${organization}/podatci/uvoz-podataka`}
              >
                <TypographyH4>Uvezi podatke iz {source}</TypographyH4>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPAge;
