'use cient';

import React from 'react';
import * as HoverCardPrimitives from '@radix-ui/react-hover-card';

import { cn } from '../lib/utils';

interface TrackerBlockProps {
  key?: string | number;
  color?: string;
  tooltip?: React.ReactNode;
}

const Block = ({
  color,
  tooltip,
  defaultBackgroundColor,
}: TrackerBlockProps & {
  defaultBackgroundColor?: string;
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <HoverCardPrimitives.Root
      open={open}
      onOpenChange={setOpen}
      openDelay={0}
      closeDelay={0}
    >
      <HoverCardPrimitives.Trigger onClick={() => setOpen(true)} asChild>
        <div
          className={cn(
            'h-full w-full rounded-[1px] first:rounded-l-[4px] last:rounded-r-[4px]',
            color || defaultBackgroundColor,
          )}
        />
      </HoverCardPrimitives.Trigger>
      <HoverCardPrimitives.Portal>
        <HoverCardPrimitives.Content
          sideOffset={10}
          side="top"
          align="center"
          avoidCollisions
          className={cn(
            // base
            'w-auto rounded-md px-2 py-1 text-sm shadow-md',
            // text color
            'text-white dark:text-gray-900',
            // background color
            'bg-gray-900 dark:bg-gray-50',
          )}
        >
          {tooltip}
        </HoverCardPrimitives.Content>
      </HoverCardPrimitives.Portal>
    </HoverCardPrimitives.Root>
  );
};

interface TrackerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TrackerBlockProps[];
  defaultBackgroundColor?: string;
}

const Tracker = React.forwardRef<HTMLDivElement, TrackerProps>(
  (
    {
      data = [],
      defaultBackgroundColor = 'bg-gray-400 dark:bg-gray-400',
      className,
      ...props
    },
    forwardedRef,
  ) => {
    return (
      <div
        ref={forwardedRef}
        className={cn(
          'flex h-10 w-full items-center gap-px sm:gap-0.5',
          className,
        )}
        {...props}
      >
        {data.map((props, index) => (
          <Block
            key={props.key ?? index}
            defaultBackgroundColor={defaultBackgroundColor}
            {...props}
          />
        ))}
      </div>
    );
  },
);

Tracker.displayName = 'TrackerElement';

Block.displayName = 'Tracker';

export { Tracker, type TrackerBlockProps };
