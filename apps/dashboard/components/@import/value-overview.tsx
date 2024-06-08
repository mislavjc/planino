import React from 'react';
import {
  SelectImportedTable,
  selectImportedTableSchema,
} from '@planino/database/schema';

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs';

type ColumnMap = {
  [key: string]: number;
};

export const transformData = (data: unknown[][], columns: ColumnMap) => {
  const result: { [key: string]: unknown[] } = {};

  for (const key in columns) {
    result[key] = [];
  }

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    for (const key in columns) {
      const columnIndex = columns[key];
      result[key].push(
        row[columnIndex] !== null && row[columnIndex] !== undefined
          ? row[columnIndex]
          : null,
      );
    }
  }

  return result;
};

export const ValueOverview = async ({
  table,
}: {
  table: SelectImportedTable;
}) => {
  const parsedTable = selectImportedTableSchema.parse(table);

  return (
    <div key={parsedTable.importedTableId}>
      <Tabs
        defaultValue={
          Object.keys(transformData(parsedTable.values, parsedTable.args))[0]
        }
      >
        <TabsList>
          {Object.entries(
            transformData(parsedTable.values, parsedTable.args),
          ).map(([key]) => (
            <TabsTrigger key={key} value={key}>
              {key}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(
          transformData(parsedTable.values, parsedTable.args),
        ).map(([key, value]) => (
          <TabsContent key={key} value={key}>
            <div className="flex flex-col border">
              {value
                .filter((v) => v !== null && v !== undefined && v !== '')
                .map((v, i) => (
                  <div key={i} className="even:bg-muted px-4 py-2">
                    {String(v)}
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
