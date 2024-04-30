import { BarChart, Table } from 'lucide-react';
import { z } from 'zod';

import { Charts as ExpenseBarCharts } from 'components/@expenses/charts';
import { Overview as ExpenseOverviewTable } from 'components/@expenses/overview';
import { Charts as InventoryBarCharts } from 'components/@inventory/charts';
import { Overview as InventoryOverviewTable } from 'components/@inventory/overview';
import { Charts as LoanBarCharts } from 'components/@loans/charts';
import { Overview as LoanOverviewTable } from 'components/@loans/overview';

/**
 * Retrieves the block component from the provided options.
 *
 * @param content - The block options.
 * @param organization - The organization name.
 * @returns The block component if found, otherwise null.
 */
export const getBlockFromOptions = async (
  content: DbBlockOptions,
  organization: string,
) => {
  const allOptions = await getBlockOptions(organization);

  for (const categoryKey of Object.keys(content)) {
    const category = categoryKey as keyof DbBlockOptions;
    const categoryOptions = content[category];
    if (categoryOptions) {
      for (const typeKey of Object.keys(categoryOptions)) {
        const type = typeKey as keyof typeof categoryOptions;
        const typeName = categoryOptions[type];

        if (
          allOptions[category] &&
          allOptions[category][type] &&
          allOptions[category][type][typeName]
        ) {
          return (
            allOptions[category][type][typeName] as { component: JSX.Element }
          ).component;
        }
      }
    }
  }

  return null;
};

export const getBlockOptions = async (organization: string) => {
  return {
    expenses: {
      label: 'Troškovi',
      charts: {
        bar: {
          icon: <BarChart />,
          label: 'Stupičasti graf',
          description: 'Prikazuje troškove po kategorijama',
          component: <ExpenseBarCharts organization={organization} />,
        },
      },
      tables: {
        yearly: {
          icon: <Table />,
          label: 'Godišnji pregled',
          description: 'Prikazuje godišnje troškove po kategorijama',
          component: <ExpenseOverviewTable organization={organization} />,
        },
      },
    },
    loans: {
      label: 'Krediti',
      charts: {
        bar: {
          icon: <BarChart />,
          label: 'Stupičasti graf',
          description: 'Prikazuje kredite po kategorijama',
          component: <LoanBarCharts organization={organization} />,
        },
      },
      tables: {
        yearly: {
          icon: <Table />,
          label: 'Godišnji pregled',
          description: 'Prikazuje godišnje kredite po kategorijama',
          component: <LoanOverviewTable organization={organization} />,
        },
      },
    },
    inventory: {
      label: 'Inventar',
      charts: {
        bar: {
          icon: <BarChart />,
          label: 'Stupičasti graf',
          description: 'Prikazuje inventar po kategorijama',
          component: <InventoryBarCharts organization={organization} />,
        },
      },
      tables: {
        yearly: {
          icon: <Table />,
          label: 'Godišnji pregled',
          description: 'Prikazuje godišnji inventar po kategorijama',
          component: <InventoryOverviewTable organization={organization} />,
        },
      },
    },
  };
};

export type BlockOptions = Awaited<ReturnType<typeof getBlockOptions>>;

const chartTypes = z.enum(['bar']);

const tableTypes = z.enum(['yearly']);

const chartSchema = z.object({
  charts: chartTypes,
});

const tableSchema = z.object({
  tables: tableTypes,
});

const categorySchema = z.union([chartSchema, tableSchema]);

export const blockOptionsSchema = z.object({
  expenses: categorySchema.optional(),
  loans: categorySchema.optional(),
  inventory: categorySchema.optional(),
});

export type DbBlockOptions = z.infer<typeof blockOptionsSchema>;
