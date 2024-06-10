import { getMonthlyAggregateCostsAndSales } from 'actions/output';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/table';

import { ProfitLossTracker } from 'components/@output/profit-loss-tracker';

import { formatCurrency } from 'lib/utils';

const ProfitAndLossPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const { values: data } = await getMonthlyAggregateCostsAndSales(organization);

  const totalCosts = data.reduce((sum, row) => sum + row.total_cost, 0);
  const totalSales = data.reduce((sum, row) => sum + row.total_sales, 0);
  const totalVariableCosts = data.reduce(
    (sum, row) => sum + row.total_variable_cost,
    0,
  );
  const totalProfits = data.reduce((sum, row) => sum + row.profit, 0);

  return (
    <div>
      <Table>
        <TableCaption>Račun dobiti i gubitka</TableCaption>
        <TableHeader>
          <TableRow className="[&>*]:text-right">
            <TableHead className="w-[100px]">Mjesec</TableHead>
            <TableHead>Ukupan fiksni trošak</TableHead>
            <TableHead>Ukupna prodaja</TableHead>
            <TableHead>Ukupan varijabilni trošak</TableHead>
            <TableHead>Profit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.month} className="text-right font-mono">
              <TableCell className="font-medium">{row.month}</TableCell>
              <TableCell>{formatCurrency(row.total_cost)}</TableCell>
              <TableCell>{formatCurrency(row.total_sales)}</TableCell>
              <TableCell>{formatCurrency(row.total_variable_cost)}</TableCell>
              <TableCell
                className={row.profit < 0 ? 'text-red-500' : 'text-green-500'}
              >
                {formatCurrency(row.profit)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="text-right font-mono">
            <TableCell colSpan={1}>Total</TableCell>
            <TableCell>{formatCurrency(totalCosts)}</TableCell>
            <TableCell>{formatCurrency(totalSales)}</TableCell>
            <TableCell>{formatCurrency(totalVariableCosts)}</TableCell>
            <TableCell
              className={totalProfits < 0 ? 'text-red-500' : 'text-green-500'}
            >
              {formatCurrency(totalProfits)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="max-w-sm">
        <ProfitLossTracker
          data={data.map((row) => ({
            color: row.profit < 0 ? 'bg-red-500' : 'bg-green-500',
            tooltip: (
              <div>
                <div>Mjesec: {row.month}</div>
                <div>
                  Ukupan fiksni trošak: {formatCurrency(row.total_cost)}
                </div>
                <div>
                  Ukupan varijabilni trošak:{' '}
                  {formatCurrency(row.total_variable_cost)}
                </div>
                <div>Ukupna prodaja: {formatCurrency(row.total_sales)}</div>
              </div>
            ),
          }))}
        />
      </div>
    </div>
  );
};

export default ProfitAndLossPage;
