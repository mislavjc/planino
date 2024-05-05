import React, { Fragment, type ReactNode, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { EditorBubble, useEditor } from 'novel';
import { removeAIHighlight } from 'novel/extensions';
import {} from 'novel/plugins';

import { Button } from 'ui/button';

import { AISelector } from './ai-selector';

interface GenerativeMenuSwitchProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (_open: boolean) => void;
}
export const GenerativeMenuSwitch = ({
  children,
  open,
  onOpenChange,
}: GenerativeMenuSwitchProps) => {
  const { editor } = useEditor();

  useEffect(() => {
    if (!open) removeAIHighlight(editor!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <EditorBubble
      tippyOptions={{
        placement: open ? 'bottom-start' : 'top',
        onHidden: () => {
          onOpenChange(false);
          editor?.chain().unsetHighlight().run();
        },
      }}
      className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
    >
      {open && <AISelector open={open} onOpenChange={onOpenChange} />}
      {!open && (
        <Fragment>
          <Button
            className="gap-1 rounded-none text-purple-500"
            variant="ghost"
            onClick={() => onOpenChange(true)}
            size="sm"
          >
            <Sparkles className="size-5" />
            Pitaj AI
          </Button>
          {children}
        </Fragment>
      )}
    </EditorBubble>
  );
};
