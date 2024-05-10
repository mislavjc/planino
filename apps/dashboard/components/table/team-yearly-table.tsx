import React from 'react';

import { TeamTotalsRow, TotalsRow } from './totals-row';

type TeamYearlyTableProps = {
  values: Array<{
    team_name: string;
    item_name: string;
    yearly_values: (number | null)[];
  }>;
  years: string[];
  numberOfYears: number;
};

export const TeamYearlyTable = ({
  values,
  years,
  numberOfYears,
}: TeamYearlyTableProps) => {
  const calculateTotals = (teamName: string) => {
    const totals = new Array(numberOfYears).fill(0);
    values.forEach((item) => {
      if (item.team_name === teamName) {
        item.yearly_values.forEach((value, index) => {
          if (value !== null) {
            totals[index] += value;
          }
        });
      }
    });
    return totals;
  };

  const calculateYearlyTotals = () => {
    const yearlyTotals = new Array(numberOfYears).fill(0);
    values.forEach((item) => {
      item.yearly_values.forEach((value, index) => {
        if (value !== null) {
          yearlyTotals[index] += value;
        }
      });
    });
    return yearlyTotals;
  };

  return (
    <div className="grid grid-cols-1 divide-y divide-gray-200 border">
      <div
        className="grid bg-gray-100"
        style={{
          gridTemplateColumns: `repeat(${numberOfYears + 1}, minmax(0, 1fr))`,
        }}
      >
        <div />
        {years.map((year) => (
          <div key={year} className="p-2 text-end font-mono">
            {year}
          </div>
        ))}
      </div>
      {values.map((item, index) => (
        <React.Fragment key={index}>
          {(index === 0 || values[index - 1].team_name !== item.team_name) && (
            <>
              {index > 0 && (
                <TeamTotalsRow
                  teamName={values[index - 1].team_name}
                  numberOfYears={numberOfYears}
                  calculateTotals={calculateTotals}
                />
              )}
              <div
                className="bg-muted/40 p-2 font-mono uppercase"
                style={{
                  gridRow: `span ${numberOfYears + 1} / span ${numberOfYears + 1}`,
                }}
              >
                {item.team_name}
              </div>
            </>
          )}
          <div
            className="grid items-end"
            style={{
              gridTemplateColumns: `repeat(${numberOfYears + 1}, minmax(0, 1fr))`,
            }}
          >
            <div className="p-2">{item.item_name}</div>
            {item.yearly_values.map((value, valueIndex) => (
              <div key={valueIndex} className="min-w-48 p-2 text-end font-mono">
                {value ? (
                  Intl.NumberFormat('hr-HR', {
                    style: 'currency',
                    currency: 'eur',
                  }).format(value)
                ) : (
                  <span className="invisible">-</span>
                )}
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
      {values.length > 0 && (
        <>
          <TeamTotalsRow
            teamName={values[values.length - 1].team_name}
            numberOfYears={numberOfYears}
            calculateTotals={calculateTotals}
          />
          <TotalsRow
            numberOfYears={numberOfYears}
            calculateYearlyTotals={calculateYearlyTotals}
          />
        </>
      )}
    </div>
  );
};
