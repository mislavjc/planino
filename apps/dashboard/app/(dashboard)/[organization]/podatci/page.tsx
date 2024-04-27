import { Suspense } from 'react';

import { ScrollArea } from 'ui/scroll-area';

import { ExcelTable } from 'components/@import/excel-table';

const DataPage = () => {
  return (
    <div className="max-h-[80vh] max-w-screen-xl overflow-auto">
      <ScrollArea className="w-max">
        <Suspense>
          <ExcelTable />
        </Suspense>
      </ScrollArea>
    </div>
  );
};

export default DataPage;
