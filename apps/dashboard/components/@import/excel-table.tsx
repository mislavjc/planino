import React from 'react';
import { z } from 'zod';

import {
  coordinatesSchema,
  getColorByTableIndex,
  isCellInAnyTable,
} from 'lib/excel';

import { FileWithTables } from './column-mapping';
import { ExcelTableCell } from './excel-table-cell';

export const runtime = 'nodejs';

const baseCellSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const excelFileSchema = z.array(
  z.array(z.union([baseCellSchema, z.undefined()])),
);

export const ExcelTable = async ({ file }: { file: FileWithTables }) => {
  const maxCols = Math.max(
    ...((file.worksheet as Array<Array<unknown>>) ?? [[]]).map(
      (row) => row.length,
    ),
  );

  const parsedWorksheet = excelFileSchema.parse(file.worksheet);

  return (
    <div
      className="relative grid"
      style={{
        gridTemplateColumns: `repeat(${maxCols}, 6rem)`,
      }}
    >
      {parsedWorksheet.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((cell, cellIndex) => {
            const [_isInTable, tableIndex] = isCellInAnyTable(
              rowIndex,
              cellIndex,
              file.importedTables.map((table) => table.coordinates),
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
                  file.importedTables.map((table) => table.coordinates),
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
      {file.importedTables.map((table, tableIndex) => {
        const { startRow, startColumn } = coordinatesSchema.parse(
          table.coordinates,
        );

        return (
          <form
            key={tableIndex}
            className="absolute bg-black"
            style={{
              gridRowStart: startRow,
              gridColumnStart: startColumn + 1,
            }}
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
