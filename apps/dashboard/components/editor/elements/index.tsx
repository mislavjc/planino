import { BarChart } from './charts/bar';
import { createChartNode } from './charts/factory';
import { elements } from './registry';

const ExpensesBarChartExtension = createChartNode({
  ChartComponent: () => <BarChart type="yearly-expense" />,
  elementName: elements.expensesBarChart,
});

const InventoryBarChartExtension = createChartNode({
  ChartComponent: () => <BarChart type="inventory" />,
  elementName: elements.inventoryBarChart,
});

export const elementsExtensions = [
  ExpensesBarChartExtension,
  InventoryBarChartExtension,
];
