import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { BarChart } from './bar';

const data = [
  { key: 'Q1', blue: '100', green: '200', red: '300' },
  { key: 'Q2', blue: '200', green: '300', red: '400' },
  { key: 'Q3', blue: '300', green: '400', red: '500' },
  { key: 'Q4', blue: '400', green: '500', red: '600' },
];

/**
 * BarStackChart component stories.
 */
const meta = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  args: {
    data,
    index: 'key',
    categories: ['blue', 'green', 'red'],
  },
} satisfies Meta<typeof BarChart>;

export default meta;

type Story = StoryObj<typeof BarChart>;

/**
 * Default BarChart story.
 */
export const Default: Story = {
  render: (args) => <BarChart {...args} className="h-[70vh]" />,
};

/**
 * Stacked BarChart story.
 */
export const Stacked: Story = {
  render: (args) => <BarChart {...args} className="h-[70vh]" type="stacked" />,
};

/**
 * Percent BarChart story.
 */
export const Percent: Story = {
  render: (args) => <BarChart {...args} className="h-[70vh]" type="percent" />,
};
