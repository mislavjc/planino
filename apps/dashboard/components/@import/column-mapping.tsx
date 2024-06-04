import React from 'react';

import { TypographyH4 } from 'components/ui/typography';

import { importer } from 'api/importer/client';

import { Mapper } from './mapper';

export const ColumnMapping = async ({ file }: { file: string }) => {
  const { data } = await importer.GET('/import/{file}/coordinates', {
    params: {
      path: {
        file: encodeURIComponent(file),
      },
    },
  });

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
