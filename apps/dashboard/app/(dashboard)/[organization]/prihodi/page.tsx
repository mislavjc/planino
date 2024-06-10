import { BarChart } from '@planino/charts';

import { getMonthlyEarnings } from 'actions/output';

import { Card, CardContent, CardHeader } from 'ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/table';
import { TypographyH3 } from 'ui/typography';

import { calculatePercentageChange, formatCurrency } from 'lib/utils';

const EarningsPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const earnings = await getMonthlyEarnings(organization);

  const productNames = Object.keys(earnings.values[0]).filter(
    (key) => key !== 'month',
  );

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <TypographyH3>Prihodi</TypographyH3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proizvod</TableHead>
                {earnings.values.map((value) => (
                  <TableHead key={value.month} className="text-right">
                    {value.month}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {productNames.map((productName) => (
                <TableRow key={productName}>
                  <TableCell className="font-medium">{productName}</TableCell>
                  {earnings.values.map((value, index) => {
                    const current = value[productName];
                    const previous =
                      index > 0 ? earnings.values[index - 1][productName] : 0;
                    const percentageChange =
                      index > 0
                        ? calculatePercentageChange(current, previous)
                        : null;

                    return (
                      <TableCell
                        key={value.month}
                        className="text-right font-mono"
                      >
                        {formatCurrency(current)}
                        {percentageChange !== null && (
                          <span
                            className={`text-xs ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {' '}
                            ({percentageChange.toFixed(2)}%)
                          </span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-medium">Ukupno</TableCell>
                {earnings.values.map((value, index) => {
                  const currentTotal = productNames.reduce(
                    (sum, productName) => sum + (value[productName] || 0),
                    0,
                  );
                  const previousTotal =
                    index > 0
                      ? productNames.reduce(
                          (sum, productName) =>
                            sum +
                            (earnings.values[index - 1][productName] || 0),
                          0,
                        )
                      : 0;
                  const percentageChange =
                    index > 0
                      ? calculatePercentageChange(currentTotal, previousTotal)
                      : null;
                  return (
                    <TableCell
                      key={value.month}
                      className="text-right font-mono"
                    >
                      {formatCurrency(currentTotal)}
                      {percentageChange !== null && (
                        <span
                          className={`text-xs ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
                        >
                          {' '}
                          ({percentageChange.toFixed(2)}%)
                        </span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <TypographyH3>Prihodi</TypographyH3>
        </CardHeader>
        <CardContent>
          <BarChart
            data={earnings.values}
            categories={
              earnings.values.length > 0
                ? Object.keys(earnings.values[0]).filter(
                    (key) => key !== 'month',
                  )
                : []
            }
            index="month"
            className="h-[50vh]"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsPage;
