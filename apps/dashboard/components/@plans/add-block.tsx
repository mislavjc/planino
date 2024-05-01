'use client';

import { Pilcrow, Plus } from 'lucide-react';

import { createBlock } from 'actions/block';

import { Button } from 'ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ui/dropdown-menu';

import { BlockOptions } from 'lib/blocks';

export const AddBlock = ({
  blockOptions,
  businessPlanId,
  organization,
}: {
  blockOptions: BlockOptions;
  businessPlanId: string;
  organization: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="flex gap-2 px-4 py-2">
          <Plus />
          Dodaj blok
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Tekst</DropdownMenuLabel>
        <MenuItem
          icon={<Pilcrow />}
          label="Tekst"
          description="Dodaj tekstualni blok"
          onClick={async () => {
            await createBlock({
              organization,
              businessPlanId,
              type: 'text',
            });
          }}
        />
        {Object.entries(blockOptions).map(
          ([blockType, { label, charts, tables }]) => (
            <div key={blockType}>
              <DropdownMenuLabel>{label}</DropdownMenuLabel>
              {Object.entries(charts).map(
                ([chartType, { label, icon, description }]) => (
                  <MenuItem
                    key={chartType}
                    icon={icon}
                    label={label}
                    description={description}
                    onClick={async () => {
                      await createBlock({
                        organization,
                        businessPlanId,
                        type: 'component',
                        content: {
                          [blockType]: {
                            charts: chartType,
                          },
                        },
                      });
                    }}
                  />
                ),
              )}
              <DropdownMenuSeparator />
              {Object.entries(tables).map(
                ([tableType, { label, icon, description }]) => (
                  <MenuItem
                    key={tableType}
                    icon={icon}
                    label={label}
                    description={description}
                    onClick={async () => {
                      await createBlock({
                        organization,
                        businessPlanId,
                        type: 'component',
                        content: {
                          [blockType]: {
                            tables: tableType,
                          },
                        },
                      });
                    }}
                  />
                ),
              )}
            </div>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const MenuItem = ({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) => {
  return (
    <DropdownMenuItem className="flex gap-2" onClick={onClick}>
      <div className="size-10 border p-2">{icon}</div>
      <div className="flex flex-col gap-1">
        <span>{label}</span>
        <span>{description}</span>
      </div>
    </DropdownMenuItem>
  );
};
