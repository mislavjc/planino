export const elements = {
  operationalExpensesBarChart: 'operationalExpensesBarChart',
  inventoryBarChart: 'inventoryBarChart',
} satisfies {
  [key: string]: string;
};

type Elements = typeof elements;

export type ElementValues = Elements[keyof Elements];
