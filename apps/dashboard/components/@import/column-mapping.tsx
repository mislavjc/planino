import React from 'react';
import {
  SelectImportedFile,
  SelectImportedTable,
} from '@planino/database/schema';

import { TypographyH4 } from 'components/ui/typography';

import { Mapper } from './mapper';

export type FileWithTables = SelectImportedFile & {
  importedTables: SelectImportedTable[];
};

export const ColumnMapping = async ({ file }: { file: FileWithTables }) => {
  return (
    <div className="flex flex-col gap-4">
      {file.importedTables.map((table, index) => {
        if (!table.coordinates) {
          return null;
        }

        return (
          <div key={index}>
            <TypographyH4>Tablica #{index + 1}</TypographyH4>
            <Mapper table={table} />
          </div>
        );
      })}
    </div>
  );
};
