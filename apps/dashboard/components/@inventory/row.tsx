'use client';

import { useState } from 'react';
import { selectInventoryItemSchema } from '@planino/database/schema';
import { Euro, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';

import {
  clearInventoryItem,
  deleteInventoryItem,
  duplicateInventoryItem,
  updateInventoryItem,
} from 'actions/inventory';

import { RowWrapper } from 'components/row-wrapper';
import { DatePicker } from 'components/table/date-picker';
import { TableInput } from 'components/table/input';

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
    createdAt,
    updatedAt,
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
    <RowWrapper
      deleteAction={() => deleteInventoryItem(inventoryItemId)}
      clearAction={() => clearInventoryItem(inventoryItemId)}
      duplicateAction={() => duplicateInventoryItem(inventoryItemId)}
      updatedAt={updatedAt ?? createdAt}
    >
      <div className="grid grid-cols-5">
        <TableInput
          className="col-span-2"
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
        />
        <TableInput
          type="number"
          value={inventoryItem.amortizationLength ?? ''}
          onChange={(e) => {
            setInventoryItem({
              ...inventoryItem,
              amortizationLength: parseInt(e.target.value),
            });
            debounceExpenseChange(
              'amortizationLength',
              parseInt(e.target.value),
            );
          }}
          icon={Timer}
        />
        <TableInput
          type="number"
          value={inventoryItem.value ?? ''}
          onChange={(e) => {
            setInventoryItem({ ...inventoryItem, value: e.target.value });
            debounceExpenseChange('value', e.target.value);
          }}
          icon={Euro}
        />
      </div>
    </RowWrapper>
  );
};
