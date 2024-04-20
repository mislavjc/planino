import React from 'react';

import { getInventoryValues } from 'actions/inventory';

export const Overview = async ({ organization }: { organization: string }) => {
  const { values, years, numberOfYears } =
    await getInventoryValues(organization);

  return (
    <div className="grid grid-cols-1 divide-y divide-gray-200 border">
      <div
        className="grid bg-gray-100 p-2"
        style={{
          gridTemplateColumns: `repeat(${numberOfYears + 1}, minmax(0, 1fr))`,
        }}
      >
        <div />
        {years.map((year) => (
          <div key={year} className="text-end font-mono">
            {year}
          </div>
        ))}
      </div>
      {values.map((item, index) => (
        <React.Fragment key={index}>
          {(index === 0 || values[index - 1].team_name !== item.team_name) && (
            <div
              className="bg-muted/40 p-2 font-mono uppercase"
              style={{
                gridRow: `span ${numberOfYears + 1} / span ${numberOfYears + 1}`,
              }}
            >
              {item.team_name}
            </div>
          )}
          <div
            className="grid items-end"
            style={{
              gridTemplateColumns: `repeat(${numberOfYears + 1}, minmax(0, 1fr))`,
            }}
          >
            <div className="p-2">{item.item_name}</div>
            {item.yearly_values.map((value, valueIndex) => (
              <div
                key={valueIndex}
                className="border border-b-0 p-2 text-end font-mono"
              >
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
    </div>
  );
};
