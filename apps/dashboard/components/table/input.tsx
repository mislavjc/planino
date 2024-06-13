import * as React from 'react';
import { LucideIcon } from 'lucide-react';

import { cn } from 'lib/utils';

import { FocusBorder } from './focus-border';

export interface TableInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputClassName?: string;
  icon?: LucideIcon;
}

const TableInput = React.forwardRef<HTMLInputElement, TableInputProps>(
  ({ className, inputClassName, type, icon: Icon, ...props }, ref) => {
    return (
      <div className={cn('group relative', className)}>
        {Icon && (
          <div className="absolute right-2 top-1/3">
            <Icon size={14} />
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md bg-background px-6 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
            inputClassName,
            {
              'pr-6': Icon,
              'text-right font-mono': type === 'number',
            },
          )}
          ref={ref}
          {...props}
        />
        <FocusBorder />
      </div>
    );
  },
);
TableInput.displayName = 'TableInput';

export { TableInput };
