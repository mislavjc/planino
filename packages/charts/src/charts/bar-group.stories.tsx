import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { BarGroupChart } from './bar-group';

/**
 * BarGroupChart component stories.
 */
const meta = {
  title: 'Charts/BarGroupChart',
  component: BarGroupChart,
  args: {
    data: [
      { key: 'Q1', blue: '100', green: '200', red: '300' },
      { key: 'Q2', blue: '200', green: '300', red: '400' },
      { key: 'Q3', blue: '300', green: '400', red: '500' },
      { key: 'Q4', blue: '400', green: '500', red: '600' },
    ],
    domainKey: 'key',
  },
} satisfies Meta<typeof BarGroupChart>;

export default meta;

type Story = StoryObj<typeof BarGroupChart>;

/**
 * Default BarGroupChart story.
 */
export const Default: Story = {
  render: (args) => (
    <div className="h-[70vh]">
      <BarGroupChart {...args} />
    </div>
  ),
};
