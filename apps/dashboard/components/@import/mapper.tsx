import React from 'react';
import {
  SelectImportedTable,
  selectImportedTableSchema,
} from '@planino/database/schema';
import { ALargeSmall, ArrowRight, BadgeEuro, Binary } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui/select';

export const expensesMap: {
  [key: string]: { name: string; icon: JSX.Element };
} = {
  name: {
    name: 'Naziv',
    icon: <ALargeSmall className="size-5" />,
  },
  quantity: {
    name: 'Količina',
    icon: <Binary className="size-5" />,
  },
  price: {
    name: 'Cijena',
    icon: <BadgeEuro className="size-5" />,
  },
  expenses: {
    name: 'Jedinični trošak',
    icon: <BadgeEuro className="size-5" />,
  },
};

export const Mapper = ({ table }: { table: SelectImportedTable }) => {
  const parsedTable = selectImportedTableSchema.parse(table);

  return (
    <div className="grid grid-cols-3 text-sm">
      <div className="bg-muted px-4 py-2 font-mono uppercase">
        Stupac iz tablice
      </div>
      <div className="bg-muted px-4 py-2"></div>
      <div className="bg-muted px-4 py-2 font-mono uppercase">Stavka</div>
      {Object.keys(parsedTable.headers ?? {}).map((key) => (
        <React.Fragment key={key}>
          <div className="border-y border-l px-4 py-2">
            {String(parsedTable.headers[key] ?? 'N/A')}
          </div>
          <div className="flex w-full border-y px-4 py-2">
            <ArrowRight className="size-4" />
          </div>
          <Select
            defaultValue={Object.keys(expensesMap).find(
              (selectKey) => selectKey === key,
            )}
          >
            <SelectTrigger className="border-l-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(parsedTable.headers).map((selectKey) => (
                <SelectItem key={selectKey} value={selectKey}>
                  <div className="flex items-center gap-2">
                    {expensesMap[selectKey].icon}
                    <div>{expensesMap[selectKey].name}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </React.Fragment>
      ))}
    </div>
  );
};
