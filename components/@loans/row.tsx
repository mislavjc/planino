'use client';

import { useState } from 'react';
import { updateLoan } from 'actions/loan';
import { useDebouncedCallback } from 'use-debounce';

import { Input } from 'ui/input';

type RowProps = {
  loanId: string;
  name: string | null;
  interestRate: string | null;
  duration: number | null;
  startingMonth: Date | null;
  amount: string | null;
};

export const Row = ({
  loanId,
  name,
  interestRate,
  duration,
  startingMonth,
  amount,
}: RowProps) => {
  const [loan, setLoan] = useState({
    name,
    interestRate,
    duration,
    startingMonth,
    amount,
  });

  const debounceLoanChange = useDebouncedCallback(
    async (field: keyof RowProps, value: string | number | Date) => {
      let formattedValue = value;
      if (value instanceof Date) {
        formattedValue = new Date(
          Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()),
        );
      }

      const updateData =
        formattedValue === undefined
          ? { [field]: null }
          : { [field]: formattedValue };

      await updateLoan({ loanId, ...updateData });
    },
    1_000,
  );

  return (
    <div className="grid grid-cols-6">
      <Input
        className="col-span-2 border-r-0"
        value={loan.name ?? ''}
        onChange={(e) => {
          setLoan({ ...loan, name: e.target.value });
          debounceLoanChange('name', e.target.value);
        }}
      />
      <Input
        type="number"
        className="border-r-0 text-right font-mono"
        value={loan.interestRate ?? ''}
        onChange={(e) => {
          setLoan({ ...loan, interestRate: e.target.value });
          debounceLoanChange('interestRate', e.target.value);
        }}
      />
      <Input
        type="number"
        className="border-r-0 text-right font-mono"
        value={loan.duration ?? 0}
        onChange={(e) => {
          setLoan({ ...loan, duration: parseInt(e.target.value) });
          debounceLoanChange('duration', parseInt(e.target.value));
        }}
      />
      <Input
        type="number"
        className="border-r-0 text-right font-mono"
        value={loan.startingMonth ? loan.startingMonth.toISOString() : ''}
        onChange={(e) => {
          setLoan({ ...loan, startingMonth: new Date(e.target.value) });
          debounceLoanChange('startingMonth', new Date(e.target.value));
        }}
      />
      <Input
        type="number"
        className="text-right font-mono"
        value={loan.amount ?? ''}
        onChange={(e) => {
          setLoan({ ...loan, amount: e.target.value });
          debounceLoanChange('amount', e.target.value);
        }}
      />
    </div>
  );
};
