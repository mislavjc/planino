import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { useParams } from 'next/navigation';

import { TeamYearlyTable as TeamYearlyTableComponent } from 'components/table/team-yearly-table';

import { CategoryType } from 'hooks/charts';
import { useTable } from 'hooks/tables';

export const TeamYearlyTable = ({ type }: { type: CategoryType }) => {
  const { organization } = useParams();

  const table = useTable({
    organization: organization as string,
    type,
  });

  return (
    <NodeViewWrapper>
      {table && (
        <TeamYearlyTableComponent
          values={table.values}
          years={table.years}
          numberOfYears={table.numberOfYears}
        />
      )}
    </NodeViewWrapper>
  );
};

TeamYearlyTable.displayName = 'TeamYearlyTable';
