import React from 'react';
import { ArrowRight } from 'lucide-react';

import { TypographyH4 } from 'components/ui/typography';

import { importer } from 'api/importer/client';

export const ColumnMapping = async ({ file }: { file: string }) => {
  const { data } = await importer.GET('/import/{file}/coordinates', {
    params: {
      path: {
        file: encodeURIComponent(file),
      },
    },
  });

  console.log(data);

  return (
    <div className="flex flex-col gap-4">
      {data?.tables.map((table, index) => {
        if (!table.coordinates) {
          return null;
        }

        return (
          <div key={index}>
            <TypographyH4>Tablica #{index + 1}</TypographyH4>
            <Mapper coordinates={table.coordinates} file={file} />
          </div>
        );
      })}
    </div>
  );
};

const Mapper = async ({
  coordinates,
  file,
}: {
  coordinates: any;
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

  type Args = {
    name: number;
    quantity: number;
    price: number;
    expenses: number;
  };

  type TableRow = unknown[][];

  function mapRow(args: Args, table: TableRow) {
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
  }

  const mappedData = mapRow(data.args, data.table);

  return (
    <div className="grid grid-cols-3">
      {Object.keys(mappedData.headersMapped).map((key) => (
        <React.Fragment key={key}>
          <div className="border px-4 py-2">
            {String(mappedData.headersMapped[key as keyof Args])}
          </div>
          <div className="flex w-full items-center justify-center border px-4 py-2">
            <ArrowRight />
          </div>
          <div className="border px-4 py-2">{key}</div>
        </React.Fragment>
      ))}
    </div>
  );
};
