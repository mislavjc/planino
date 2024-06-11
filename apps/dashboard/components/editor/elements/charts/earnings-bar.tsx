import { BarChart } from '@planino/charts';
import { NodeViewWrapper } from '@tiptap/react';
import { useParams } from 'next/navigation';

import { useEarnings } from 'hooks/earnings';

export const EarningsBarChart = () => {
  const { organization } = useParams();

  const earnings = useEarnings({
    organization: organization as string,
  });

  if (!earnings) {
    return null;
  }

  return (
    <NodeViewWrapper className="overflow-auto">
      <BarChart
        data={earnings.values}
        categories={
          earnings.values.length > 0
            ? Object.keys(earnings.values[0]).filter((key) => key !== 'month')
            : []
        }
        index="month"
        className="h-[50vh]"
      />
    </NodeViewWrapper>
  );
};
