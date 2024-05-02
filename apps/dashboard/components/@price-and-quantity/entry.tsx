'use client';

import React, { useState } from 'react';
import {
  selectProductPriceHistorySchema,
  selectProductSchema,
} from '@planino/database/schema';
import { addMonths } from 'date-fns';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';

import { createProductPriceHistory } from 'actions/product';
import { updateProduct } from 'actions/product';

import { SubmitButton } from 'components/submit-button';
import { TableInput } from 'components/table/input';

import { PriceHistoryRow } from './row';

type Product = z.infer<typeof selectProductSchema>;

export type ProductPriceHistory = z.infer<
  typeof selectProductPriceHistorySchema
>;

type EntryProps = {
  product: Product & { priceHistory: ProductPriceHistory[] };
};

export const Entry = ({ product }: EntryProps) => {
  const [productState, setProductState] = useState({
    ...product,
    priceHistory: [],
  });

  const lastPrice = product.priceHistory[product.priceHistory.length - 1];

  const nextMonth = addMonths(lastPrice.recordedMonth, 1);

  const debouncedUpdateProduct = useDebouncedCallback(async () => {
    await updateProduct(productState.productId, {
      name: productState.name ?? '',
      unitType: productState.unitType ?? '',
    });
  }, 1_000);

  return (
    <div className="grid grid-cols-4">
      <TableInput
        placeholder="Naziv"
        inputClassName="bg-muted/60"
        className="col-span-3"
        value={productState.name ?? ''}
        onChange={(e) => {
          setProductState({ ...productState, name: e.target.value });

          debouncedUpdateProduct();
        }}
      />
      <TableInput
        placeholder="Jedinica mjere"
        inputClassName="bg-muted/60"
        className="col-span-1"
        value={productState.unitType ?? ''}
        onChange={(e) => {
          setProductState({ ...productState, unitType: e.target.value });

          debouncedUpdateProduct();
        }}
      />
      <PriceHistoryRow priceHistory={product.priceHistory[0]} firstRow />
      {product.priceHistory.slice(1).map((priceHistory) => (
        <PriceHistoryRow
          key={priceHistory.productPriceId}
          priceHistory={priceHistory}
        />
      ))}
      <form action={createProductPriceHistory} className="col-span-4">
        <input type="hidden" value={productState.productId} name="productId" />
        <input
          type="hidden"
          value={nextMonth.toDateString()}
          name="recordedMonth"
        />
        <SubmitButton
          disabled={
            !lastPrice.unitPrice ||
            !lastPrice.unitCount ||
            !lastPrice.unitExpense
          }
        />
      </form>
    </div>
  );
};
