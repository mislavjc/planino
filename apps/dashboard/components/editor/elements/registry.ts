export const elements = {
  operationalExpensesBarChart: 'operationalExpensesBarChart',
  operationalExpensesTeamYearlyTable: 'operationalExpensesTeamYearlyTable',
  inventoryBarChart: 'inventoryBarChart',
  inventoryYearlyTable: 'inventoryYearlyTable',
  teamsBarChart: 'teamsBarChart',
  teamsYearlyTable: 'teamsYearlyTable',
  loansBarChart: 'loansBarChart',
  loansYearlyTable: 'loansYearlyTable',
  monthlyEarningsTable: 'monthlyEarningsTable',
} satisfies {
  [key: string]: string;
};

type Elements = typeof elements;

export type ElementValues = Elements[keyof Elements];
