import { BarChart, Table } from 'lucide-react';

import { Charts as ExpenseBarCharts } from 'components/@expenses/charts';
import { Overview as ExpenseOverviewTable } from 'components/@expenses/overview';
import { Charts as InventoryBarCharts } from 'components/@inventory/charts';
import { Overview as InventoryOverviewTable } from 'components/@inventory/overview';
import { Charts as LoanBarCharts } from 'components/@loans/charts';
import { Overview as LoanOverviewTable } from 'components/@loans/overview';

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
