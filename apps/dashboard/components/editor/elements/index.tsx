import { BarChart } from './charts/bar';
import { createChartNode } from './charts/factory';
import { elements } from './registry';

const OperationalExpensesBarChartExtension = createChartNode({
  ChartComponent: () => <BarChart type="operational-expenses" />,
  elementName: elements.operationalExpensesBarChart,
});

const InventoryBarChartExtension = createChartNode({
  ChartComponent: () => <BarChart type="inventory" />,
  elementName: elements.inventoryBarChart,
});

const TeamsBarChartExtension = createChartNode({
  ChartComponent: () => <BarChart type="teams" />,
  elementName: elements.teamsBarChart,
});

export const elementsExtensions = [
  OperationalExpensesBarChartExtension,
  InventoryBarChartExtension,
  TeamsBarChartExtension,
];
