import { ExcelFile } from 'routes/import';

export const extractMultipleTables = (worksheet: ExcelFile) => {
  const tables: ExcelFile[] = [];
  let searchStartRow = 0;

  while (searchStartRow < worksheet.length) {
    const result = findNextTable(worksheet, searchStartRow);
    if (!result) break;

    const { table, nextStartRow } = result;
    tables.push(table);
    searchStartRow = nextStartRow;
  }

  return tables;
};

const findNextTable = (worksheet: ExcelFile, startSearchFromRow: number) => {
  let startRow: number | null = null;
  let startColumn: number | null = null;
  let endColumn: number | null = null;

  for (let i = startSearchFromRow; i < worksheet.length; i++) {
    const row = worksheet[i];

    for (let j = 0; j < row.length; j++) {
      const currentCell = row[j];
      const nextCell = row[j + 1];

      if (currentCell && nextCell && startColumn === null) {
        startColumn = j;
        startRow = i;
      }

      if (currentCell && !nextCell && startColumn !== null) {
        endColumn = j;
        break;
      }
    }

    if (endColumn !== null) break;
  }

  if (startRow === null || startColumn === null || endColumn === null) {
    return null;
  }

  if (startColumn > 0 && startRow !== null) {
    for (let i = startRow; i < worksheet.length; i++) {
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
  const nextStartRow =
    tableEndRow >= 0 ? startRow + tableEndRow + 2 : worksheet.length;

  return {
    table,
    nextStartRow,
  };
};
