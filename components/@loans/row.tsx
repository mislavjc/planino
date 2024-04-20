'use client';

import { useState } from 'react';
import { Euro, Percent } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

import { updateLoan } from 'actions/loan';

import { DatePicker } from 'components/date-picker';
import { TableInput } from 'components/table/input';

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
    <div className="grid grid-cols-7">
      <TableInput
        className="col-span-2"
        value={loan.name ?? ''}
        onChange={(e) => {
          setLoan({ ...loan, name: e.target.value });
          debounceLoanChange('name', e.target.value);
        }}
      />
      <TableInput
        type="number"
        value={loan.interestRate ?? ''}
        onChange={(e) => {
          setLoan({ ...loan, interestRate: e.target.value });
          debounceLoanChange('interestRate', e.target.value);
        }}
        icon={Percent}
      />
      <TableInput
        type="number"
        value={loan.duration ?? ''}
        onChange={(e) => {
          setLoan({ ...loan, duration: parseInt(e.target.value) });
          debounceLoanChange('duration', parseInt(e.target.value));
        }}
      />
      <TableInput
        type="number"
        value={loan.amount ?? ''}
        onChange={(e) => {
          setLoan({ ...loan, amount: e.target.value });
          debounceLoanChange('amount', e.target.value);
        }}
        icon={Euro}
      />
      <DatePicker
        date={loan.startingMonth ?? undefined}
        setDate={(date) => {
          if (!date) return;

          setLoan({ ...loan, startingMonth: date });
          debounceLoanChange('startingMonth', date);
        }}
        className="col-span-2"
      />
    </div>
  );
};
