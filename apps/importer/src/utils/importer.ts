import { Coordinates, ExcelFile } from 'routes/import';

export const extractMultipleTableCoordinates = (worksheet: ExcelFile) => {
  const tables: Array<{ coordinates: Coordinates }> = [];

  let stillFindingTables = true;

  while (stillFindingTables) {
    try {
      const extractedTableInfo = extractTable(worksheet);
      tables.push({
        coordinates: {
          startRow: extractedTableInfo.startRow,
          startColumn: extractedTableInfo.startColumn,
          endRow: extractedTableInfo.endRow,
          endColumn: extractedTableInfo.endColumn,
        },
      });

      for (
        let i = extractedTableInfo.startRow;
        i < extractedTableInfo.endRow;
        i++
      ) {
        for (
          let j = extractedTableInfo.startColumn;
          j <= extractedTableInfo.endColumn;
          j++
        ) {
          worksheet[i][j] = null;
        }
      }
    } catch (error) {
      stillFindingTables = false;
    }
  }

  return tables;
};
const extractTable = (worksheet: ExcelFile) => {
  let startRow: number | null = null;
  let startColumn: number | null = null;
  let endColumn: number | null = null;
  let endRow: number | null = null;

  for (let i = 0; i < worksheet.length; i++) {
    const row = worksheet[i];
    for (let j = 0; j < row.length; j++) {
      const currentCell = row[j];
      const nextCell = row[j + 1];

      if (currentCell && nextCell !== undefined) {
        if (startColumn === null) {
          startColumn = j;
          startRow = i;
        }
      }

      if (currentCell && nextCell === undefined) {
        endColumn = j;
        break;
      }
    }

    if (startColumn !== null && endColumn !== null) {
      break;
    }
  }

  if (startRow === null || startColumn === null || endColumn === null) {
    throw new Error('Invalid excel file');
  }

  if (startColumn > 0 && startRow !== null) {
    for (let i = startRow + 1; i < worksheet.length; i++) {
      if (worksheet[i][startColumn - 1]) {
        startColumn -= 1;
        break;
      }
    }
  }

  endRow = worksheet
    .slice(startRow)
    .findIndex(
      (row, index) =>
        index > 0 &&
        row
          .slice(startColumn, endColumn + 1)
          .every((cell) => cell === null || cell === ''),
    );

  if (endRow === -1) {
    endRow = worksheet.length;
  } else {
    endRow += startRow;
  }

  const table = worksheet
    .slice(startRow, endRow)
    .map((row) => row.slice(startColumn, endColumn + 1));

  return {
    table,
    startRow,
    startColumn,
    endColumn,
    endRow,
  };
};
