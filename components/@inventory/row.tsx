'use client';

import { useState } from 'react';
import { Euro, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';

import { selectInventoryItemSchema } from 'db/schema';

import { updateInventoryItem } from 'actions/inventory';

import { Input } from 'ui/input';

import { DatePicker } from 'components/date-picker';
import { InputWithIcon } from 'components/input-with-icon';

type InventoryItemSelect = z.infer<typeof selectInventoryItemSchema>;

type RowProps = {
  inventoryItem: InventoryItemSelect;
};

export const Row = ({
  inventoryItem: {
    amortizationLength,
    inventoryItemId,
    name,
    startingMonth,
    value,
  },
}: RowProps) => {
  const [inventoryItem, setInventoryItem] = useState({
    amortizationLength,
    name,
    startingMonth,
    value,
  });

  const debounceExpenseChange = useDebouncedCallback(
    async (field: keyof InventoryItemSelect, value: string | number | Date) => {
      let formattedValue = value;
      if (value instanceof Date) {
        formattedValue = new Date(
          Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()),
        );
      }

      const updateData = {
        inventoryItemId,
        [field]: formattedValue,
      };

      try {
        await updateInventoryItem(updateData);
      } catch (error) {
        toast.error('Neuspješno ažuriranje troška.');
      }
    },
    1_000,
  );

  return (
    <div className="grid grid-cols-5">
      <Input
        className="col-span-2 border-r-0"
        value={inventoryItem.name ?? ''}
        onChange={(e) => {
          setInventoryItem({ ...inventoryItem, name: e.target.value });
          debounceExpenseChange('name', e.target.value);
        }}
      />
      <DatePicker
        date={inventoryItem.startingMonth ?? undefined}
        setDate={(date) => {
          if (!date) return;

          setInventoryItem({ ...inventoryItem, startingMonth: date });
          debounceExpenseChange('startingMonth', date);
        }}
        className="border-r-0"
      />
      <InputWithIcon
        type="number"
        className="border-r-0 text-right font-mono"
        value={inventoryItem.amortizationLength ?? ''}
        onChange={(e) => {
          setInventoryItem({
            ...inventoryItem,
            amortizationLength: parseInt(e.target.value),
          });
          debounceExpenseChange('amortizationLength', parseInt(e.target.value));
        }}
        icon={Timer}
      />
      <InputWithIcon
        type="number"
        className="text-right font-mono"
        value={inventoryItem.value ?? ''}
        onChange={(e) => {
          setInventoryItem({ ...inventoryItem, value: e.target.value });
          debounceExpenseChange('value', e.target.value);
        }}
        icon={Euro}
      />
    </div>
  );
};
