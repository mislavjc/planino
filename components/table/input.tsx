import * as React from 'react';
import { LucideIcon } from 'lucide-react';

import { cn } from 'lib/utils';

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
          <div className="absolute left-1 top-3 mr-6">
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
            inputClassName,
            {
              'pl-8': Icon,
              'text-right font-mono': type === 'number',
            },
          )}
          ref={ref}
          {...props}
        />
        <div className="pointer-events-none absolute inset-0 group-focus-within:border-[3px] group-focus-within:border-blue-500" />
      </div>
    );
  },
);
TableInput.displayName = 'TableInput';

export { TableInput };
