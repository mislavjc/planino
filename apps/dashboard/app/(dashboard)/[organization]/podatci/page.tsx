import React from 'react';

import { ScrollArea } from 'components/ui/scroll-area';

import { importer } from 'api/importer/client';

interface TableCoordinates {
  startRow: number;
  startColumn: number;
  endRow: number;
  endColumn: number;
}

const generateIndexArray = (
  coordinates: TableCoordinates,
): [number, number][] => {
  const { startRow, endRow, startColumn, endColumn } = coordinates;
  let indexArray: [number, number][] = [];

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startColumn; col <= endColumn; col++) {
      indexArray.push([row, col]);
    }
  }

  return indexArray;
};

const isCellInAnyTable = (
  cellRow: number,
  cellColumn: number,
  tables: TableCoordinates[],
): [boolean, number] => {
  for (let i = 0; i < tables.length; i++) {
    const indexes = generateIndexArray(tables[i]);
    if (indexes.some(([row, col]) => row === cellRow && col === cellColumn)) {
      return [true, i];
    }
  }
  return [false, -1];
};
const predefinedColors = [
  'hsla(0, 100%, 70%, 0.15)', // Red Pink
  'hsla(30, 100%, 75%, 0.15)', // Peach
  'hsla(60, 100%, 85%, 0.15)', // Pale Yellow
  'hsla(90, 100%, 80%, 0.15)', // Tea Green
  'hsla(180, 100%, 75%, 0.15)', // Baby Blue
  'hsla(210, 100%, 80%, 0.15)', // Blue Mauve
  'hsla(270, 100%, 80%, 0.15)', // Mauve
  'hsla(300, 100%, 80%, 0.15)', // Pink
  'hsla(60, 100%, 95%, 0.15)', // Ivory
  'hsla(150, 60%, 75%, 0.15)', // Eton Blue
];

const getColorByTableIndex = (index: number) => {
  if (index === -1) {
    return 'transparent';
  }

  return predefinedColors[index % predefinedColors.length];
};

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
    <div className="max-h-[80vh] max-w-screen-xl overflow-auto">
      <ScrollArea className="w-max">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${maxCols}, 6rem)`,
          }}
        >
          {data.worksheet.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((cell, cellIndex) => {
                const [_isInTable, tableIndex] = isCellInAnyTable(
                  rowIndex,
                  cellIndex,
                  data.tables.map((table) => table.coordinates),
                );

                return (
                  <div
                    key={cellIndex}
                    className="h-6 truncate border border-gray-300 p-1 font-mono text-xs"
                    style={{
                      backgroundColor: getColorByTableIndex(tableIndex),
                    }}
                  >
                    {String(cell ?? '')}
                  </div>
                );
              })}
              {row.length < maxCols &&
                Array.from({ length: maxCols - row.length }).map(
                  (_, emptyIndex) => {
                    const [_isInTable, tableIndex] = isCellInAnyTable(
                      rowIndex,
                      row.length + emptyIndex,
                      data.tables.map((table) => table.coordinates),
                    );

                    return (
                      <div
                        key={emptyIndex}
                        className="h-6 truncate border border-gray-300 p-2 font-mono"
                        style={{
                          backgroundColor: getColorByTableIndex(tableIndex),
                        }}
                      />
                    );
                  },
                )}
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DataPage;
