import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

export const createChartNode = ({
  elementName,
  ChartComponent,
}: {
  elementName: string;
  ChartComponent: React.ComponentType<unknown>;
}) => {
  const node = Node.create({
    name: elementName,

    group: 'block',
    atom: true,

    parseHTML() {
      return [
        {
          tag: elementName,
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      return [elementName, mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
      return ReactNodeViewRenderer(ChartComponent);
    },
  });

  return node;
};
