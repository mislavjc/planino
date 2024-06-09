export const elements = {
  operationalExpensesBarChart: 'operationalExpensesBarChart',
  inventoryBarChart: 'inventoryBarChart',
  teamsBarChart: 'teamsBarChart',
} satisfies {
  [key: string]: string;
};

type Elements = typeof elements;

export type ElementValues = Elements[keyof Elements];
