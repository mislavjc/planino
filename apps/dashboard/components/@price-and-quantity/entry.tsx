'use client';

import React, { useState } from 'react';
import {
  selectProductPriceHistorySchema,
  selectProductSchema,
} from '@planino/database/schema';
import { addMonths, format } from 'date-fns';
import { z } from 'zod';

import { createProductPriceHistory } from 'actions/product';

import { SubmitButton } from 'components/submit-button';
import { DatePicker } from 'components/table/date-picker';
import { TableInput } from 'components/table/input';

type Product = z.infer<typeof selectProductSchema>;

type productPriceHistory = z.infer<typeof selectProductPriceHistorySchema>;

type EntryProps = {
  product: Product & { priceHistory: productPriceHistory[] };
};

export const Entry = ({ product }: EntryProps) => {
  const [productState, setProductState] = useState(product);

  const dateOfLastPrice =
    productState.priceHistory[productState.priceHistory.length - 1]
      ?.recordedMonth;

  const nextMonth = addMonths(dateOfLastPrice, 1);

  return (
    <div className="grid grid-cols-4">
      <TableInput placeholder="Naziv" className="col-span-4" />
      <DatePicker
        date={
          productState.priceHistory?.length
            ? productState.priceHistory[0].recordedMonth
            : new Date()
        }
        setDate={(date) => {
          setProductState({
            ...productState,
            priceHistory: [
              {
                ...productState.priceHistory?.[0],
                recordedMonth: date as Date,
              },
            ],
          });
        }}
      />
      <TableInput placeholder="Količina" />
      <TableInput placeholder="Cijena" />
      <TableInput placeholder="Jedinični trošak" />
      {productState.priceHistory.slice(1).map((priceHistory) => (
        <React.Fragment key={priceHistory.productPriceId}>
          <div className="bg-background border-input flex h-10 items-center border px-3 py-2 text-sm">
            {format(priceHistory.recordedMonth.toDateString(), 'MM. yyyy.')}
          </div>
          <TableInput placeholder="Količina" />
          <TableInput placeholder="Cijena" />
          <TableInput placeholder="Jedinični trošak" />
        </React.Fragment>
      ))}
      <form action={createProductPriceHistory} className="col-span-4">
        <input type="hidden" value={productState.productId} name="productId" />
        <input
          type="hidden"
          value={nextMonth.toDateString()}
          name="recordedMonth"
        />
        <SubmitButton />
      </form>
    </div>
  );
};
