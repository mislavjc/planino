import React from 'react';

import { ScrollArea } from 'components/ui/scroll-area';

import { importer } from 'api/importer/client';

const DataPage = async () => {
  const { data, error } = await importer.GET('/import/{file}/coordinates', {
    params: {
      path: {
        file: 'five.xlsx',
      },
    },
  });

  if (error) {
    throw new Error(error.error);
  }

  const maxCols = Math.max(...data.worksheet.map((row) => row.length));

  return (
    <div className="max-h-[60vh] max-w-screen-xl overflow-auto">
      <ScrollArea className="w-max">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${maxCols}, 10rem)`,
          }}
        >
          {data.worksheet.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className="h-10 truncate border border-gray-300 p-2 font-mono"
                >
                  {String(cell ?? '')}
                </div>
              ))}
              {row.length < maxCols &&
                Array.from({ length: maxCols - row.length }).map(
                  (_, emptyIndex) => (
                    <div
                      key={emptyIndex}
                      className="h-10 border border-gray-300 p-2"
                    />
                  ),
                )}
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DataPage;
