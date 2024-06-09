import { BarStackChart } from '@planino/charts';
import { mergeAttributes, Node } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { useParams } from 'next/navigation';

import { TypographyH4 } from 'components/ui/typography';

import { useChart } from 'hooks/charts';

import { elements } from '../registry';

const Component = () => {
  const { organization } = useParams();

  const chart = useChart({
    organization: organization as string,
    type: 'yearly-expense',
  });

  return (
    <NodeViewWrapper>
      <div className="grid xl:grid-cols-2">
        {chart?.values.map((team) => (
          <div key={team.name}>
            <TypographyH4>{team.name}</TypographyH4>
            <div className="h-[60vh]">
              <BarStackChart
                key={team.name}
                data={team.values}
                domainKey="year"
              />
            </div>
          </div>
        ))}
      </div>
    </NodeViewWrapper>
  );
};

export const ExpensesBarChart = Node.create({
  name: elements.expensesBarChart,

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      count: {
        default: 0,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: elements.expensesBarChart,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [elements.expensesBarChart, mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
