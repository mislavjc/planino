import React from 'react';

import { getColorByTableIndex, isCellInAnyTable } from 'lib/excel';

import { importer } from 'api/importer/client';

import { ExcelTableCell } from './excel-table-cell';

export const runtime = 'nodejs';

export const ExcelTable = async ({ file }: { file: string }) => {
  const { data, error } = await importer.GET('/import/{file}/coordinates', {
    params: {
      path: {
        file: encodeURIComponent(file),
      },
    },
  });

  if (error) {
    throw new Error(error.error);
  }

  const maxCols = Math.max(...data.worksheet.map((row) => row.length));

  const sendDataForExtraction = async (formData: FormData) => {
    'use server';

    const coordinates =
      data.tables[Number(formData.get('tableIndex'))].coordinates;

    const { data: extracted, error: extractedError } = await importer.POST(
      '/import/extract-data',
      {
        body: {
          worksheet: data.worksheet,
          coordinates,
        },
      },
    );

    console.log(extracted?.data);
  };

  return (
    <div
      className="relative grid"
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
              <ExcelTableCell
                key={cellIndex}
                backgroundColor={getColorByTableIndex(tableIndex)}
              >
                {String(cell ?? '')}
              </ExcelTableCell>
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
                  <ExcelTableCell
                    key={emptyIndex}
                    backgroundColor={getColorByTableIndex(tableIndex)}
                  />
                );
              },
            )}
        </React.Fragment>
      ))}
      {data.tables.map((table, tableIndex) => {
        const { startRow, startColumn } = table.coordinates;
        return (
          <form
            key={tableIndex}
            className="absolute bg-black"
            style={{
              gridRowStart: startRow,
              gridColumnStart: startColumn + 1,
            }}
            action={sendDataForExtraction}
          >
            <input type="hidden" name="tableIndex" value={tableIndex} />
            <button className="h-6 p-1 font-mono text-xs uppercase text-white">
              {tableIndex + 1}. tablica
            </button>
          </form>
        );
      })}
    </div>
  );
};
