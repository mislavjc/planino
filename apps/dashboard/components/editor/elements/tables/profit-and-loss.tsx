import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { useParams } from 'next/navigation';

import { ProfitLossTable as ProfitLossTableComponent } from 'components/@output/profit-loss-table';

import { useProfitLossTable } from 'hooks/profit-and-loss';

export const ProfitLossTable = () => {
  const { organization } = useParams();

  const profitLossData = useProfitLossTable({
    organization: organization as string,
  });

  if (!profitLossData) {
    return null;
  }

  return (
    <NodeViewWrapper className="overflow-auto">
      <ProfitLossTableComponent data={profitLossData} />
    </NodeViewWrapper>
  );
};
