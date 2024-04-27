type TableCoordinates = {
  startRow: number;
  startColumn: number;
  endRow: number;
  endColumn: number;
};

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

export const predefinedColors = [
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

export const getColorByTableIndex = (index: number) => {
  if (index === -1) {
    return 'transparent';
  }

  return predefinedColors[index % predefinedColors.length];
};
