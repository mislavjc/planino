import { Card, CardContent, CardHeader } from 'ui/card';
import { TypographyH3 } from 'ui/typography';

const BreakEvenPointPage = () => {
  return (
    <div className="flex flex-col gap-2">
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Točka pokrića</TypographyH3>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};

export default BreakEvenPointPage;
