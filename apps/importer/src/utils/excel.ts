import { excelFileSchema } from 'routes/import';
import * as XLSX from 'xlsx';

export const openExcelFile = (file: ArrayBuffer) => {
  const workbook = XLSX.read(file);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const excel = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    blankrows: true,
  });

  const parsedExcel = excelFileSchema.parse(excel);

  return {
    excel,
    parsedExcel,
  };
};
