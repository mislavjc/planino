import { cn } from 'lib/utils';

import { SubmitButton } from './submit-button';

export const AddRow = ({
  action,
  className,
  children,
  fullHeight,
}: {
  action: () => Promise<void>;

  className?: string;
  children?: string;
  fullHeight?: boolean;
}) => {
  return (
    <form
      action={async () => {
        'use server';

        await action();
      }}
      className={className}
    >
      <SubmitButton
        className={cn({
          'h-full': fullHeight,
        })}
      >
        {children || 'Dodaj red'}
      </SubmitButton>
    </form>
  );
};
