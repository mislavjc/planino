'use client';

import { MoveDownRight, MoveUpRight } from 'lucide-react';

import { MonthlyEarnings } from 'actions/output';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/table';

import { calculatePercentageChange, formatCurrency } from 'lib/utils';

export const EarningsTable = ({ earnings }: { earnings: MonthlyEarnings }) => {
  const productNames = Object.keys(earnings.values[0]).filter(
    (key) => key !== 'month',
  );

  return (
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
                index > 0 ? calculatePercentageChange(current, previous) : null;

              return (
                <TableCell key={value.month} className="text-right font-mono">
                  {formatCurrency(current)}
                  {percentageChange !== null && (
                    <span
                      className={`text-xs ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {' '}
                      ({percentageChange.toFixed(2)}%
                      {percentageChange >= 0 ? (
                        <MoveUpRight className="inline-block size-3" />
                      ) : (
                        <MoveDownRight className="inline-block size-3" />
                      )}
                      )
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
                      sum + (earnings.values[index - 1][productName] || 0),
                    0,
                  )
                : 0;
            const percentageChange =
              index > 0
                ? calculatePercentageChange(currentTotal, previousTotal)
                : null;
            return (
              <TableCell key={value.month} className="text-right font-mono">
                {formatCurrency(currentTotal)}
                {percentageChange !== null && (
                  <span
                    className={`text-xs ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {' '}
                    ({percentageChange.toFixed(2)}%
                    {percentageChange >= 0 ? (
                      <MoveUpRight className="inline-block size-3" />
                    ) : (
                      <MoveDownRight className="inline-block size-3" />
                    )}
                    )
                  </span>
                )}
              </TableCell>
            );
          })}
        </TableRow>
      </TableBody>
    </Table>
  );
};
