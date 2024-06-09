import { getBreakEvenPoint } from 'actions/output';

import { Card, CardContent, CardHeader } from 'ui/card';
import { TypographyH3 } from 'ui/typography';

const BreakEvenPointPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const data = await getBreakEvenPoint(organization);

  return (
    <div className="flex flex-col gap-2">
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Točka pokrića</TypographyH3>
        </CardHeader>
        <CardContent>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreakEvenPointPage;
