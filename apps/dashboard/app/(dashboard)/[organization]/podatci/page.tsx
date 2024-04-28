import { Suspense } from 'react';

import { ScrollArea } from 'ui/scroll-area';

import { ExcelTable } from 'components/@import/excel-table';
import { FileDropzone } from 'components/@import/upload-file';

const DataPage = () => {
  return (
    <div className="max-h-[80vh] max-w-screen-xl overflow-auto">
      <FileDropzone />
      <ScrollArea className="w-max">
        <Suspense>
          <ExcelTable />
        </Suspense>
      </ScrollArea>
    </div>
  );
};

export default DataPage;
