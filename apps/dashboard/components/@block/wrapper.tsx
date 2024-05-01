'use client';

import { EllipsisVertical } from 'lucide-react';

import { deleteBlock } from 'actions/block';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui/dropdown-menu';

import { Button } from 'components/ui/button';

export const BlockWrapper = ({
  children,
  blockId,
}: {
  children: React.ReactNode;
  blockId: string;
}) => {
  return (
    <div className="group relative">
      <div className="absolute -left-6 top-1/2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="invisible grid place-items-center group-hover:visible"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => deleteBlock({ blockId })}
              className="text-red-600"
            >
              Obriši
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {children}
    </div>
  );
};
