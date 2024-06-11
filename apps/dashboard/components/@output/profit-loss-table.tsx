import { MonthlyAggregateFixedCosts } from 'actions/output';

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

import { formatCurrency } from 'lib/utils';

export const ProfitLossTable = ({
  data,
}: {
  data: MonthlyAggregateFixedCosts;
}) => {
  const { values } = data;

  const totalCosts = values.reduce((sum, row) => sum + row.total_cost, 0);
  const totalSales = values.reduce((sum, row) => sum + row.total_sales, 0);
  const totalVariableCosts = values.reduce(
    (sum, row) => sum + row.total_variable_cost,
    0,
  );
  const totalProfits = values.reduce((sum, row) => sum + row.profit, 0);

  return (
    <Table>
      <TableCaption>Račun dobiti i gubitka</TableCaption>
      <TableHeader>
        <TableRow className="[&>*]:text-right">
          <TableHead className="w-[100px]">Mjesec</TableHead>
          <TableHead>Ukupna prodaja</TableHead>
          <TableHead>Ukupan fiksni trošak</TableHead>
          <TableHead>Ukupan varijabilni trošak</TableHead>
          <TableHead>Profit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {values.map((row) => (
          <TableRow key={row.month} className="text-right font-mono">
            <TableCell className="font-medium">{row.month}</TableCell>
            <TableCell>{formatCurrency(row.total_sales)}</TableCell>
            <TableCell>{formatCurrency(row.total_cost)}</TableCell>
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
          <TableCell colSpan={1}>Ukupno</TableCell>
          <TableCell>{formatCurrency(totalSales)}</TableCell>
          <TableCell>{formatCurrency(totalCosts)}</TableCell>
          <TableCell>{formatCurrency(totalVariableCosts)}</TableCell>
          <TableCell
            className={totalProfits < 0 ? 'text-red-500' : 'text-green-500'}
          >
            {formatCurrency(totalProfits)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
