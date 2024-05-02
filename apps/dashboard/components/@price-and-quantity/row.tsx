import React, { useState } from 'react';
import { format } from 'date-fns';
import { Euro } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

import { updateProductPriceHistory } from 'actions/product';

import { DatePicker } from 'components/table/date-picker';
import { TableInput } from 'components/table/input';

import { ProductPriceHistory } from './entry';

export const PriceHistoryRow = ({
  priceHistory,
  firstRow,
}: {
  priceHistory: ProductPriceHistory;
  firstRow?: boolean;
}) => {
  const [productPriceHistory, setProductPriceHistory] = useState(priceHistory);

  const debouncePriceHistoryChange = useDebouncedCallback(
    async (field: keyof ProductPriceHistory, value: string) => {
      console.log('debouncePriceHistoryChange', field, value);

      await updateProductPriceHistory({
        ...productPriceHistory,
      });
    },
    1_000,
  );

  return (
    <React.Fragment>
      {firstRow ? (
        <DatePicker
          date={priceHistory.recordedMonth}
          setDate={(date) => {
            setProductPriceHistory({
              ...productPriceHistory,
              recordedMonth: date ?? new Date(),
            });
            debouncePriceHistoryChange(
              'recordedMonth',
              date?.toDateString() ?? new Date().toDateString(),
            );
          }}
        />
      ) : (
        <div className="bg-background border-input flex h-10 items-center border px-3 py-2 text-sm">
          {format(priceHistory.recordedMonth.toDateString(), 'MM. yyyy.')}
        </div>
      )}
      <TableInput
        placeholder="Jedinična cijena"
        type="number"
        icon={Euro}
        value={productPriceHistory.unitPrice ?? ''}
        onChange={(e) => {
          setProductPriceHistory({
            ...productPriceHistory,
            unitPrice: e.target.value,
          });
          debouncePriceHistoryChange('unitPrice', e.target.value);
        }}
      />
      <TableInput
        placeholder="Jedinični trošak"
        type="number"
        icon={Euro}
        value={productPriceHistory.unitExpense ?? ''}
        onChange={(e) => {
          setProductPriceHistory({
            ...productPriceHistory,
            unitExpense: e.target.value,
          });
          debouncePriceHistoryChange('unitExpense', e.target.value);
        }}
      />
      <TableInput
        placeholder="Količina"
        type="number"
        value={productPriceHistory.unitCount ?? ''}
        onChange={(e) => {
          setProductPriceHistory({
            ...productPriceHistory,
            unitCount: e.target.value,
          });
          debouncePriceHistoryChange('unitCount', e.target.value);
        }}
      />
    </React.Fragment>
  );
};
