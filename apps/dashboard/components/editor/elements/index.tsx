import { BarChart } from './charts/bar';
import { TeamYearlyTable } from './tables/team-yearly-table';
import { createNode } from './factory';
import { elements } from './registry';

const OperationalExpensesBarChartExtension = createNode({
  Component: () => <BarChart type="operational-expenses" />,
  elementName: elements.operationalExpensesBarChart,
});

const OperationalExpensesTeamYearlyTableExtension = createNode({
  Component: () => <TeamYearlyTable type="operational-expenses" />,
  elementName: elements.operationalExpensesTeamYearlyTable,
});

const InventoryBarChartExtension = createNode({
  Component: () => <BarChart type="inventory" />,
  elementName: elements.inventoryBarChart,
});

const TeamsBarChartExtension = createNode({
  Component: () => <BarChart type="teams" />,
  elementName: elements.teamsBarChart,
});

const LoansBarChartExtension = createNode({
  Component: () => <BarChart type="loans" />,
  elementName: elements.loansBarChart,
});

export const elementsExtensions = [
  OperationalExpensesBarChartExtension,
  OperationalExpensesTeamYearlyTableExtension,
  InventoryBarChartExtension,
  TeamsBarChartExtension,
  LoansBarChartExtension,
];
