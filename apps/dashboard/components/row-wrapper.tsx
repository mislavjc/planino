import { CircleX, Copy, GripVertical, Trash } from 'lucide-react';

import { Button } from 'ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ui/dropdown-menu';

export const RowWrapper = ({
  children,
  updatedAt,
  deleteAction,
  duplicateAction,
  clearAction,
}: {
  children: React.ReactNode;
  updatedAt: string | Date;
  deleteAction: () => void;
  duplicateAction: () => void;
  clearAction: () => void;
}) => {
  return (
    <div className="group/wrapper relative">
      {children}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="invisible absolute left-0 top-3 size-5 p-1 group-hover/wrapper:visible"
          asChild
        >
          <Button size="icon" variant="secondary">
            <GripVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={duplicateAction}>
            <Copy className="mr-2 size-4" />
            Dupliciraj
          </DropdownMenuItem>
          <DropdownMenuItem onClick={clearAction}>
            <CircleX className="mr-2 size-4" />
            Očisti
          </DropdownMenuItem>
          <DropdownMenuItem onClick={deleteAction} className="text-red-600">
            <Trash className="mr-2 size-4" />
            Obriši
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex gap-2 text-xs font-normal">
            <div>Promijenjeno</div>
            {new Date(updatedAt).toLocaleDateString('hr-HR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
