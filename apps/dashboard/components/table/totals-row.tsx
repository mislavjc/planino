import { Sigma } from 'lucide-react';

import { formatCurrency } from 'lib/utils';

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
      <div className="bg-muted/60 flex items-center gap-2 p-2">
        <Sigma size={16} />
      </div>
      {calculateTotals(teamName).map((total, idx) => (
        <div
          key={idx}
          className="bg-muted/60 border border-b-0 p-2 text-end font-mono"
        >
          {formatCurrency(total)}
        </div>
      ))}
    </div>
  );
};

export const TotalsRow = ({
  numberOfYears,
  calculateYearlyTotals,
}: {
  numberOfYears: number;
  calculateYearlyTotals: () => number[];
}) => {
  return (
    <div
      className="grid font-mono uppercase"
      style={{
        gridTemplateColumns: `repeat(${numberOfYears + 1}, minmax(0, 1fr))`,
      }}
    >
      <div className="p-2">Ukupno</div>
      {calculateYearlyTotals().map((total, index) => (
        <div key={index} className="p-2 text-end">
          {formatCurrency(total)}
        </div>
      ))}
    </div>
  );
};
