import { BarChart } from './charts/bar';
import { createChartNode } from './factory';
import { elements } from './registry';

const OperationalExpensesBarChartExtension = createChartNode({
  Component: () => <BarChart type="operational-expenses" />,
  elementName: elements.operationalExpensesBarChart,
});

const InventoryBarChartExtension = createChartNode({
  Component: () => <BarChart type="inventory" />,
  elementName: elements.inventoryBarChart,
});

const TeamsBarChartExtension = createChartNode({
  Component: () => <BarChart type="teams" />,
  elementName: elements.teamsBarChart,
});

const LoansBarChartExtension = createChartNode({
  Component: () => <BarChart type="loans" />,
  elementName: elements.loansBarChart,
});

export const elementsExtensions = [
  OperationalExpensesBarChartExtension,
  InventoryBarChartExtension,
  TeamsBarChartExtension,
  LoansBarChartExtension,
];
