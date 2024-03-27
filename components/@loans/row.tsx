import { Input } from 'ui/input';

type RowProps = {
  name: string;
  interestRate: number;
  duration: number;
  startingMonth: number;
  amount: number;
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
      <Input className="col-span-2 border-r-0" value={name} />
      <Input
        type="number"
        className="border-r-0 text-right font-mono"
        value={interestRate}
      />
      <Input
        type="number"
        className="border-r-0 text-right font-mono"
        value={duration}
      />
      <Input
        type="number"
        className="border-r-0 text-right font-mono"
        value={startingMonth}
      />
      <Input type="number" className="text-right font-mono" value={amount} />
    </div>
  );
};
