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

  const debouncePriceHistoryChange = useDebouncedCallback(async () => {
    await updateProductPriceHistory({
      ...productPriceHistory,
    });
  }, 1_000);

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
            debouncePriceHistoryChange();
          }}
          className="font-mono"
        />
      ) : (
        <div className="border-input bg-background flex h-10 items-center border px-6 py-2 font-mono text-sm">
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
          debouncePriceHistoryChange();
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
          debouncePriceHistoryChange();
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
          debouncePriceHistoryChange();
        }}
      />
    </React.Fragment>
  );
};
