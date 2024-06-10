import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Tracker } from './tracker';

const data = [
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-red-600', tooltip: 'Error' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-red-600', tooltip: 'Error' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-yellow-600', tooltip: 'Warn' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
  { color: 'bg-emerald-600', tooltip: 'Tracker Info' },
];

/**
 * BarStackChart component stories.
 */
const meta = {
  title: 'Charts/Tracker',
  component: Tracker,
  tags: ['autodocs'],
  args: {
    data,
  },
} satisfies Meta<typeof Tracker>;

export default meta;

type Story = StoryObj<typeof Tracker>;

/**
 * Default Tracker story.
 */
export const Default: Story = {
  render: (args) => <Tracker {...args} />,
};
