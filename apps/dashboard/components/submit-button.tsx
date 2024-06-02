'use client';

import { useFormStatus } from 'react-dom';
import { Loader2, LucideIcon, Plus } from 'lucide-react';

import { cn } from 'lib/utils';

import { FocusBorder } from './table/focus-border';
import { Button } from './ui/button';
import { TypographyP } from './ui/typography';

export const SubmitButton = ({
  className,
  children = 'Dodaj red',
  disabled,
  icon: Icon = Plus,
}: {
  className?: string;
  children?: string;
  disabled?: boolean;
  icon?: LucideIcon;
}) => {
  const status = useFormStatus();

  return (
    <Button
      type="submit"
      className={cn('group relative flex w-full justify-start', className)}
      variant="outline"
      disabled={disabled || status.pending}
      ring={false}
    >
      {status.pending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <div className="flex items-center gap-2">
          <Icon className="size-4" />
          <TypographyP>{children}</TypographyP>
        </div>
      )}
      <FocusBorder />
    </Button>
  );
};
