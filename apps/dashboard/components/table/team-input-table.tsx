'use client';

import { TypographyP } from 'components/ui/typography';

import { cn } from 'lib/utils';

import { EditableHeader } from './editable-header';

type TeamInputTableProps = {
  header: Array<{
    title: string;
    width?: 1 | 2;
    align?: 'left' | 'right';
  }>;
  teams: Array<{
    teamId: string;
    name: string | null;
    items: React.ReactNode;
    add: React.ReactNode;
  }>;
  onHeaderChange?: (_value: { id: string; value: string }) => Promise<void>;
  headerPlaceholder?: string;
};

export const TeamInputTable = ({
  header,
  teams,
  onHeaderChange,
  headerPlaceholder,
}: TeamInputTableProps) => {
  const headerColumnWidth = header.reduce(
    (acc, column) => acc + (column.width || 1),
    0,
  );

  return (
    <div>
      <div className="flex flex-col gap-4">
        {teams.map((team) => (
          <div key={team.teamId}>
            {onHeaderChange ? (
              <EditableHeader
                onChange={onHeaderChange}
                value={team.name || ''}
                id={team.teamId}
                placeholder={headerPlaceholder}
              />
            ) : (
              <div className="bg-muted border px-4 py-2 font-mono text-sm uppercase">
                {team.name}
              </div>
            )}
            <div
              className="grid text-sm"
              style={{
                gridTemplateColumns: `repeat(${headerColumnWidth}, minmax(0, 1fr))`,
              }}
            >
              {header.map((column, index) => (
                <TypographyP
                  key={index}
                  className={cn('border p-2 pl-6 pr-6 text-sm bg-muted', {
                    'text-left': column.align === 'left',
                    'col-span-2': column.width === 2,
                  })}
                >
                  {column.title}
                </TypographyP>
              ))}
            </div>
            {team.items}
            {team.add}
          </div>
        ))}
      </div>
    </div>
  );
};
