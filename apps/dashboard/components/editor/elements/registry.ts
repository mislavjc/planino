export const elements = {
  expensesBarChart: 'expensesBarChart',
  inventoryBarChart: 'inventoryBarChart',
} satisfies {
  [key: string]: string;
};

type Elements = typeof elements;

export type ElementValues = Elements[keyof Elements];
