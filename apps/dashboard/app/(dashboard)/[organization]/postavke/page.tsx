import { Card, CardContent, CardHeader } from 'ui/card';
import { TypographyH3 } from 'ui/typography';

const SettingsPage = () => {
  return (
    <div>
      <Card className="max-w-screen-sm">
        <CardHeader>
          <TypographyH3>Postavke organizacije</TypographyH3>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
