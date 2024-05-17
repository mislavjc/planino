import type { StoryObj, Meta } from '@storybook/react';

import { BarStackChart } from './bar-stack';

/**
 * BarStackChart component stories.
 */
const meta = {
  title: 'Charts/BarStackChart',
  component: BarStackChart,
  args: {
    data: [
      { key: 'Q1', blue: '100', green: '200', red: '300' },
      { key: 'Q2', blue: '200', green: '300', red: '400' },
      { key: 'Q3', blue: '300', green: '400', red: '500' },
      { key: 'Q4', blue: '400', green: '500', red: '600' },
    ],
    domainKey: 'key',
  },
} satisfies Meta<typeof BarStackChart>;

export default meta;

type Story = StoryObj<typeof BarStackChart>;

/**
 * Default BarStackChart story.
 */
export const Default: Story = {
  render: (args) => (
    <div className="h-[70vh]">
      <BarStackChart {...args} />
    </div>
  ),
};
