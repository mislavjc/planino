import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { useParams } from 'next/navigation';

import { EarningsTable as EarningsTableComponent } from 'components/@output/earnings-table';

import { useEarningsTable } from 'hooks/earnings';

export const EarningsTable = () => {
  const { organization } = useParams();

  const monthlyEarnings = useEarningsTable({
    organization: organization as string,
  });

  if (!monthlyEarnings) {
    return null;
  }

  return (
    <NodeViewWrapper className="overflow-auto">
      <EarningsTableComponent earnings={monthlyEarnings} />
    </NodeViewWrapper>
  );
};
