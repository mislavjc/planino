import { TypographyP } from 'components/ui/typography';

import { cn } from 'lib/utils';

type TeamInputTableProps = {
  header: Array<{
    title: string;
    width?: 1 | 2;
    align?: 'left' | 'right';
  }>;
  teams: Array<{
    teamId: string;
    name: string;
    items: React.ReactNode;
    add: React.ReactNode;
  }>;
};

export const TeamInputTable = ({ header, teams }: TeamInputTableProps) => {
  const headerColumnWidth = header.reduce(
    (acc, column) => acc + (column.width || 1),
    0,
  );

  return (
    <div>
      <div
        className="grid text-sm"
        style={{
          gridTemplateColumns: `repeat(${headerColumnWidth}, minmax(0, 1fr))`,
        }}
      >
        {header.map((column, index) => (
          <TypographyP
            key={index}
            className={cn({
              'text-left': column.align === 'left',
              'text-right': column.align === 'right',
              'col-span-2': column.width === 2,
            })}
          >
            {column.title}
          </TypographyP>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {teams.map((team) => (
          <div key={team.teamId}>
            <div className="bg-muted px-4 py-2 font-mono text-sm uppercase">
              {team.name}
            </div>
            {team.items}
            {team.add}
          </div>
        ))}
      </div>
    </div>
  );
};
