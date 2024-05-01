'use client';

import { useState } from 'react';
import Markdown from 'react-markdown';
import { useCompletion } from 'ai/react';
import { CommandList } from 'cmdk';
import { ArrowUp, Sparkles } from 'lucide-react';
import { useEditor } from 'novel';
import { addAIHighlight } from 'novel/extensions';
import { toast } from 'sonner';

import { Button } from 'ui/button';
import { Command, CommandInput } from 'ui/command';
import { ScrollArea } from 'ui/scroll-area';

import { CrazySpinner } from 'components/crazy-spinner';

import { AICompletionCommands } from './ai-completion-command';
import { AISelectorCommands } from './ai-selector-commands';

interface AISelectorProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
}

export function AISelector({ open, onOpenChange }: AISelectorProps) {
  const { editor } = useEditor();
  const [inputValue, setInputValue] = useState('');

  const { completion, complete, isLoading } = useCompletion({
    api: '/api/generate',
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error('Došli ste do limita uputa.');
        return;
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const hasCompletion = completion.length > 0;

  return (
    <Command className="w-[350px]">
      <CommandList>
        {hasCompletion && (
          <div className="flex max-h-[400px]">
            <ScrollArea>
              <div className="prose prose-sm p-2 px-4">
                <Markdown>{completion}</Markdown>
              </div>
            </ScrollArea>
          </div>
        )}

        {isLoading && (
          <div className="flex h-12 w-full items-center px-4 text-sm font-medium text-purple-500">
            <Sparkles className="mr-2 size-4 shrink-0  " />
            AI razmišlja...
            <div className="ml-2 mt-1">
              <CrazySpinner />
            </div>
          </div>
        )}
        {!isLoading && (
          <>
            <div className="relative">
              <CommandInput
                value={inputValue}
                onValueChange={setInputValue}
                autoFocus
                placeholder={
                  hasCompletion
                    ? 'Reci AI što dalje da radi'
                    : 'Pitaj AI da promjeni ili generira...'
                }
                onFocus={() => addAIHighlight(editor!)}
              />
              <Button
                size="icon"
                className="absolute right-2 top-1/2 size-6 -translate-y-1/2 rounded-full bg-purple-500 hover:bg-purple-900"
                onClick={() => {
                  if (completion)
                    return complete(completion, {
                      body: { option: 'zap', command: inputValue },
                    }).then(() => setInputValue(''));

                  const slice = editor?.state.selection.content();
                  const text = editor?.storage.markdown.serializer.serialize(
                    slice?.content,
                  );

                  complete(text, {
                    body: { option: 'zap', command: inputValue },
                  }).then(() => setInputValue(''));
                }}
              >
                <ArrowUp className="size-4" />
              </Button>
            </div>
            {hasCompletion ? (
              <AICompletionCommands
                onDiscard={() => {
                  editor?.chain().unsetHighlight().focus().run();
                  onOpenChange(false);
                }}
                completion={completion}
              />
            ) : (
              <AISelectorCommands
                onSelect={(value, option) =>
                  complete(value, { body: { option } })
                }
              />
            )}
          </>
        )}
      </CommandList>
    </Command>
  );
}
