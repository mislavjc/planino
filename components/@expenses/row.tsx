'use client';

import { useState } from 'react';
import { Euro, Percent } from 'lucide-react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';

import { selectExpenseSchema, selectFinancialAttributeSchema } from 'db/schema';

import { updateExpense } from 'actions/expense';

import { DatePicker } from 'components/date-picker';
import { TableInput } from 'components/table/input';

type ExpenseSelect = z.infer<typeof selectExpenseSchema>;

type FinancialAttributeSelect = z.infer<typeof selectFinancialAttributeSchema>;

type RowProps = {
  expense: ExpenseSelect & {
    financialAttribute: FinancialAttributeSelect;
  };
};

export const Row = ({
  expense: {
    financialAttributeId,
    expenseId,
    name,
    financialAttribute: { raisePercentage, startingMonth, endingMonth, amount },
  },
}: RowProps) => {
  const [expense, setExpense] = useState({
    name,
    raisePercentage,
    startingMonth,
    endingMonth,
    amount,
  });

  const debounceExpenseChange = useDebouncedCallback(
    async (
      field: keyof FinancialAttributeSelect | 'name',
      value: string | number | Date,
    ) => {
      let formattedValue = value;
      if (value instanceof Date) {
        formattedValue = new Date(
          Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()),
        );
      }

      if (
        expense.endingMonth &&
        field === 'startingMonth' &&
        formattedValue > expense.endingMonth
      ) {
        toast.error(
          'Mjesec početka obračuna ne može biti nakon mjeseca kraja obračuna.',
        );
        return;
      }

      if (
        expense.startingMonth &&
        field === 'endingMonth' &&
        formattedValue < expense.startingMonth
      ) {
        toast.error(
          'Mjesec kraja obračuna ne može biti prije mjeseca početka obračuna.',
        );
        return;
      }

      if (field === 'amount' && (formattedValue as number) < 0) {
        toast.error('Iznos troška ne može biti negativan.');

        return;
      }

      if (
        (field === 'amount' && value === '') ||
        (field === 'raisePercentage' && value === '')
      ) {
        formattedValue = '0';
      }

      if (field === 'name') {
        try {
          await updateExpense({
            expense: {
              expenseId,
              name: formattedValue as string,
            },
          });
        } catch (error) {
          toast.error('Neuspješno ažuriranje naziva troška.');
        }

        return;
      }

      const updateData = {
        financialAttributeId,
        [field]: formattedValue,
      };

      try {
        await updateExpense({
          financialAttribute: updateData,
        });
      } catch (error) {
        toast.error('Neuspješno ažuriranje troška.');
      }
    },
    1_000,
  );

  return (
    <div className="grid grid-cols-6">
      <TableInput
        className="col-span-2"
        value={expense.name ?? ''}
        onChange={(e) => {
          setExpense({ ...expense, name: e.target.value });
          debounceExpenseChange('name', e.target.value);
        }}
      />
      <DatePicker
        date={expense.startingMonth ?? undefined}
        setDate={(date) => {
          if (!date) return;

          setExpense({ ...expense, startingMonth: date });
          debounceExpenseChange('startingMonth', date);
        }}
      />
      <DatePicker
        date={expense.endingMonth ?? undefined}
        setDate={(date) => {
          if (!date) return;

          setExpense({ ...expense, endingMonth: date });
          debounceExpenseChange('endingMonth', date);
        }}
      />
      <TableInput
        type="number"
        value={expense.amount ?? ''}
        onChange={(e) => {
          setExpense({ ...expense, amount: e.target.value });
          debounceExpenseChange('amount', e.target.value);
        }}
        icon={Euro}
      />
      <TableInput
        type="number"
        value={expense.raisePercentage ?? ''}
        onChange={(e) => {
          setExpense({ ...expense, raisePercentage: e.target.value });
          debounceExpenseChange('raisePercentage', e.target.value);
        }}
        icon={Percent}
      />
    </div>
  );
};
