'use client';

import { Plus } from 'lucide-react';

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
import { getRandomColor } from 'lib/utils';

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
        {Object.entries(blockOptions).map(
          ([blockType, { label, charts, tables }]) => (
            <div key={blockType}>
              <DropdownMenuLabel>{label}</DropdownMenuLabel>
              {Object.entries(charts).map(
                ([chartType, { label, icon, description }]) => (
                  <DropdownMenuItem
                    key={chartType}
                    className="flex gap-2"
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
                  >
                    <div
                      className="size-10 p-2"
                      style={{
                        backgroundColor: getRandomColor(label),
                      }}
                    >
                      {icon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span>{label}</span>
                      <span>{description}</span>
                    </div>
                  </DropdownMenuItem>
                ),
              )}
              <DropdownMenuSeparator />
              {Object.entries(tables).map(
                ([tableType, { label, icon, description }]) => (
                  <DropdownMenuItem
                    key={tableType}
                    className="flex gap-2"
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
                  >
                    <div
                      className="size-10 p-2"
                      style={{
                        backgroundColor: getRandomColor(description, 0.25),
                      }}
                    >
                      {icon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span>{label}</span>
                      <span>{description}</span>
                    </div>
                  </DropdownMenuItem>
                ),
              )}
            </div>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
