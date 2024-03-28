import { format } from 'date-fns';
import { hr } from 'date-fns/locale';

import { Button } from 'ui/button';
import { Calendar } from 'ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'ui/popover';

import { cn } from 'lib/utils';

export const DatePicker = ({
  date,
  setDate,
  className,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className,
          )}
        >
          {date ? (
            format(date, 'PPP', {
              locale: hr,
            })
          ) : (
            <span>Odaberi datum</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={hr}
        />
      </PopoverContent>
    </Popover>
  );
};