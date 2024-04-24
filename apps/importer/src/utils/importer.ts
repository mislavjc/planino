import { ExcelFile } from 'routes/import';

export const extractTable = (worksheet: ExcelFile) => {
  let startRow: number | null = null;
  let startColumn: number | null = null;
  let endColumn: number | null = null;

  for (let i = 0; i < worksheet.length; i++) {
    const row = worksheet[i];

    for (let j = 0; j < row.length; j++) {
      const currentCell = row[j];
      const nextCell = row[j + 1];

      if (currentCell && nextCell) {
        if (startColumn === null) {
          startColumn = j;
          startRow = i;
        }
      }

      if (currentCell && !nextCell) {
        endColumn = j;
        break;
      }
    }
  }

  if (startRow === null || startColumn === null || endColumn === null) {
    throw new Error('Invalid excel file');
  }

  if (startColumn !== null && startColumn > 0 && startRow !== null) {
    for (let i = startRow + 1; i < worksheet.length; i++) {
      if (worksheet[i][startColumn - 1]) {
        startColumn -= 1;
        break;
      }
    }
  }

  const tableEndRow = worksheet
    .slice(startRow + 1)
    .findIndex((row) => row.every((cell) => cell === null || cell === ''));

  const table = worksheet
    .slice(
      startRow,
      tableEndRow >= 0 ? startRow + tableEndRow + 1 : worksheet.length,
    )
    .map((row) => row.slice(startColumn, endColumn + 1));

  return table;
};
