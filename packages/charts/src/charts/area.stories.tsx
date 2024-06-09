import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { AreaChart } from './area';

const getRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const data = [
  {
    key: 'Q1',
    blue: getRandomValue(100, 300),
    green: getRandomValue(200, 400),
    red: getRandomValue(300, 500),
  },
  {
    key: 'Q2',
    blue: getRandomValue(200, 400),
    green: getRandomValue(300, 500),
    red: getRandomValue(400, 600),
  },
  {
    key: 'Q3',
    blue: getRandomValue(300, 500),
    green: getRandomValue(400, 600),
    red: getRandomValue(500, 700),
  },
  {
    key: 'Q4',
    blue: getRandomValue(400, 600),
    green: getRandomValue(500, 700),
    red: getRandomValue(600, 800),
  },
  {
    key: 'Q5',
    blue: getRandomValue(500, 700),
    green: getRandomValue(600, 800),
    red: getRandomValue(700, 900),
  },
  {
    key: 'Q6',
    blue: getRandomValue(600, 800),
    green: getRandomValue(700, 900),
    red: getRandomValue(800, 1000),
  },
  {
    key: 'Q7',
    blue: getRandomValue(700, 900),
    green: getRandomValue(800, 1000),
    red: getRandomValue(900, 1100),
  },
  {
    key: 'Q8',
    blue: getRandomValue(800, 1000),
    green: getRandomValue(900, 1100),
    red: getRandomValue(1000, 1200),
  },
];

/**
 * BarStackChart component stories.
 */
const meta = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  tags: ['autodocs'],
  args: {
    data,
    index: 'key',
    categories: ['blue', 'green', 'red'],
  },
} satisfies Meta<typeof AreaChart>;

export default meta;

type Story = StoryObj<typeof AreaChart>;

/**
 * Default AreaChart story.
 */
export const Default: Story = {
  render: (args) => <AreaChart {...args} className="h-[70vh]" />,
};

/**
 * Stacked AreaChart story.
 */
export const Stacked: Story = {
  render: (args) => <AreaChart {...args} className="h-[70vh]" type="stacked" />,
};

/**
 * Percent AreaChart story.
 */
export const Percent: Story = {
  render: (args) => <AreaChart {...args} className="h-[70vh]" type="percent" />,
};
