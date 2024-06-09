import React from 'react';
import { BarChart as BarChartComponent } from '@planino/charts';
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
            <BarChartComponent
              key={item.name}
              data={item.values}
              index="year"
              type="stacked"
              className="h-[60vh]"
              categories={
                item.values.length > 0
                  ? Object.keys(item.values[0]).filter((key) => key !== 'year')
                  : []
              }
            />
          </div>
        ))}
      </div>
    </NodeViewWrapper>
  );
};

BarChart.displayName = 'BarChart';
