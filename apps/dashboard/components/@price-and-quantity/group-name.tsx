'use client';

import { useState } from 'react';
import { selectProductGroupSchema } from '@planino/database/schema';
import { z } from 'zod';

import { updateProductGroup } from 'actions/product';

import { TableInput } from 'components/table/input';

type ProductGroup = z.infer<typeof selectProductGroupSchema>;

export const GroupName = ({ productGroup }: { productGroup: ProductGroup }) => {
  const [name, setName] = useState(productGroup.name);

  return (
    <TableInput
      value={name || ''}
      placeholder="Naziv grupe"
      inputClassName="bg-muted/60"
      onChange={(e) => setName(e.target.value)}
      onBlur={() => {
        updateProductGroup({
          productGroupId: productGroup.productGroupId,
          name: name || '',
        });
      }}
    />
  );
};
