export const elements = {
  operationalExpensesBarChart: 'operationalExpensesBarChart',
  inventoryBarChart: 'inventoryBarChart',
  teamsBarChart: 'teamsBarChart',
  loansBarChart: 'loansBarChart',
} satisfies {
  [key: string]: string;
};

type Elements = typeof elements;

export type ElementValues = Elements[keyof Elements];
