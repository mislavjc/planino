import { predefinedColors } from './utils';

type TableCoordinates = {
  startRow: number;
  startColumn: number;
  endRow: number;
  endColumn: number;
};

/**
 * Generates an array of index pairs based on the provided table coordinates.
 *
 * @param coordinates - The table coordinates specifying the start and end rows and columns.
 * @returns An array of index pairs representing the rows and columns within the specified coordinates.
 */
const generateIndexArray = (coordinates: TableCoordinates) => {
  const { startRow, endRow, startColumn, endColumn } = coordinates;
  let indexArray: [number, number][] = [];

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startColumn; col <= endColumn; col++) {
      indexArray.push([row, col]);
    }
  }

  return indexArray;
};

/**
 * Checks if a cell is present in any table.
 * @param cellRow - The row index of the cell.
 * @param cellColumn - The column index of the cell.
 * @param tables - An array of table coordinates.
 * @returns A tuple containing a boolean indicating if the cell is in any table, and the index of the table if found.
 */
export const isCellInAnyTable = (
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

/**
 * Returns the color based on the table index.
 * If the index is -1, it returns 'transparent'.
 * Otherwise, it returns a color from the predefinedColors array based on the index.
 * @param index - The table index.
 * @returns The color corresponding to the index.
 */
export const getColorByTableIndex = (index: number) => {
  if (index === -1) {
    return 'transparent';
  }

  return predefinedColors[index % predefinedColors.length];
};

export const extractTableFromCoordinates = (
  worksheet: unknown[][],
  coordinates: {
    startRow: number;
    startColumn: number;
    endRow: number;
    endColumn: number;
  },
) => {
  const { startRow, startColumn, endRow, endColumn } = coordinates;

  return worksheet
    .slice(startRow, endRow)
    .map((row) => row.slice(startColumn, endColumn + 1));
};
