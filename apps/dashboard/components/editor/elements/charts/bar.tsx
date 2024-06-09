import React from 'react';
import { BarStackChart } from '@planino/charts';
import { NodeViewWrapper } from '@tiptap/react';
import { useParams } from 'next/navigation';

import { TypographyH4 } from 'components/ui/typography';

import { CategoryType, useChart } from 'hooks/charts';

export const BarChart = ({ type }: { type: CategoryType }) => {
  const { organization } = useParams();

  const chart = useChart({
    organization: organization as string,
    type,
  });

  return (
    <NodeViewWrapper>
      <div className="grid xl:grid-cols-2">
        {chart?.values.map((item) => (
          <div key={item.name}>
            <TypographyH4>{item.name}</TypographyH4>
            <div className="h-[60vh]">
              <BarStackChart
                key={item.name}
                data={item.values}
                domainKey="year"
              />
            </div>
          </div>
        ))}
      </div>
    </NodeViewWrapper>
  );
};

BarChart.displayName = 'BarChart';
