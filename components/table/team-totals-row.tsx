import { Sigma } from 'lucide-react';

type TeamTotalsRowProps = {
  teamName: string;
  numberOfYears: number;
  calculateTotals: (_teamName: string) => number[];
};

export const TeamTotalsRow = ({
  teamName,
  numberOfYears,
  calculateTotals,
}: TeamTotalsRowProps) => {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${numberOfYears + 1}, minmax(0, 1fr))`,
      }}
    >
      <div className="flex items-center gap-2 bg-muted/60 p-2">
        <Sigma size={16} />
      </div>
      {calculateTotals(teamName).map((total, idx) => (
        <div
          key={idx}
          className="border border-b-0 bg-muted/60 p-2 text-end font-mono"
        >
          {Intl.NumberFormat('hr-HR', {
            style: 'currency',
            currency: 'eur',
          }).format(total)}
        </div>
      ))}
    </div>
  );
};
