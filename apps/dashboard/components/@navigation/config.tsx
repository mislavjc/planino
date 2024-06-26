import {
  ArrowDownToDot,
  ArrowUpDown,
  Coins,
  Euro,
  Factory,
  FileText,
  GanttChartSquare,
  PiggyBank,
  Receipt,
  Table,
  Users,
  Wallet,
  Warehouse,
} from 'lucide-react';

type ConfigItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
};

export type TemplateConfig = {
  input: ConfigItem[];
  output: ConfigItem[];
  documents: ConfigItem[];
};

export const templateConfig: TemplateConfig = {
  input: [
    {
      label: 'Operativni troškovi',
      href: '/operativni-troskovi',
      icon: <Factory width={16} className="text-neutral-600" />,
    },
    {
      label: 'Imovina i oprema',
      href: '/imovina-i-oprema',
      icon: <Warehouse width={16} className="text-neutral-600" />,
    },
    {
      label: 'Cijena i količina',
      href: '/cijena-i-kolicina',
      icon: <Coins width={16} className="text-neutral-600" />,
    },
    {
      label: 'Otplatni plan',
      href: '/otplatni-plan',
      icon: <GanttChartSquare width={16} className="text-neutral-600" />,
    },
    {
      label: 'Odjeli',
      href: '/odjeli',
      icon: <Users width={16} className="text-neutral-600" />,
    },
    {
      label: 'Podatci',
      href: '/podatci',
      icon: <Table width={16} className="text-neutral-600" />,
    },
  ],
  output: [
    {
      label: 'Točka pokrića',
      href: '/tocka-pokrica',
      icon: <ArrowDownToDot width={16} className="text-neutral-600" />,
    },
    {
      label: 'Troškovi',
      href: '/troskovi',
      icon: <Receipt width={16} className="text-neutral-600" />,
    },
    {
      label: 'Prihodi',
      href: '/prihodi',
      icon: <Euro width={16} className="text-neutral-600" />,
    },
    {
      label: 'Račun dobiti i gubitka',
      href: '/racun-dobiti-i-gubitka',
      icon: <Wallet width={16} className="text-neutral-600" />,
    },
    {
      label: 'Bilanca',
      href: '/bilanca',
      icon: <PiggyBank width={16} className="text-neutral-600" />,
    },
    {
      label: 'Novčani tok',
      href: '/novcani-tok',
      icon: <ArrowUpDown width={16} className="text-neutral-600" />,
    },
  ],
  documents: [
    {
      label: 'Poslovni planovi',
      href: '/poslovni-planovi',
      icon: <FileText width={16} className="text-neutral-600" />,
    },
  ],
};
