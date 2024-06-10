'use client';

import { Tracker, TrackerBlockProps } from '@planino/charts';

export const ProfitLossTracker = ({ data }: { data: TrackerBlockProps[] }) => (
  <Tracker data={data} />
);
