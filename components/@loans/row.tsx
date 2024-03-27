import { Input } from 'ui/input';

type RowProps = {
  name: string | null;
  interestRate: string | null;
  duration: number | null;
  startingMonth: Date | null;
  amount: string | null;
};

export const Row = ({
  name,
  interestRate,
  duration,
  startingMonth,
  amount,
}: RowProps) => {
  return (
    <div className="grid grid-cols-6">
      <Input className="col-span-2 border-r-0" value={name ?? ''} />
      <Input
        type="number"
        className="border-r-0 text-right font-mono"
        value={interestRate ?? ''}
      />
      <Input
        type="number"
        className="border-r-0 text-right font-mono"
        value={duration ?? 0}
      />
      <Input
        type="number"
        className="border-r-0 text-right font-mono"
        value={startingMonth ? startingMonth.toISOString() : ''}
      />
      <Input
        type="number"
        className="text-right font-mono"
        value={amount ?? ''}
      />
    </div>
  );
};
