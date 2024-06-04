import React from 'react';
import { ArrowRight } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui/select';

import { importer } from 'api/importer/client';

type Args = {
  name: number;
  quantity: number;
  price: number;
  expenses: number;
};

type TableRow = unknown[][];

const mapRow = (args: Args, table: TableRow) => {
  const headers = table[0];

  const headersMapped = {
    name: headers[args.name],
    quantity: headers[args.quantity],
    price: headers[args.price],
    expenses: headers[args.expenses],
  };

  return {
    headersMapped,
  };
};

export const Mapper = async ({
  coordinates,
  file,
}: {
  coordinates: {
    startRow: number;
    startColumn: number;
    endRow: number;
    endColumn: number;
  };
  file: string;
}) => {
  const { data } = await importer.GET('/import/{file}/extract-data', {
    params: {
      path: {
        file: encodeURIComponent(file),
      },
      query: {
        coordinates: JSON.stringify(coordinates),
      },
    },
  });

  if (!data?.args) {
    return null;
  }

  const mappedData = mapRow(data.args, data.table);

  return (
    <div className="grid grid-cols-3 text-sm">
      <div className="bg-muted px-4 py-2 font-mono uppercase">
        Stupac iz tablice
      </div>
      <div className="bg-muted px-4 py-2"></div>
      <div className="bg-muted px-4 py-2 font-mono uppercase">Stavka</div>
      {Object.keys(mappedData.headersMapped).map((key) => (
        <React.Fragment key={key}>
          <div className="border-y border-l px-4 py-2">
            {String(mappedData.headersMapped[key as keyof Args] ?? 'N/A')}
          </div>
          <div className="flex w-full border-y px-4 py-2">
            <ArrowRight className="size-4" />
          </div>
          <Select defaultValue={key}>
            <SelectTrigger className="border-l-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(mappedData.headersMapped).map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </React.Fragment>
      ))}
    </div>
  );
};
