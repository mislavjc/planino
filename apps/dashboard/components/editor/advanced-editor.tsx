'use client';

import { useState } from 'react';
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandList,
  EditorContent,
  EditorInstance,
  EditorRoot,
  type JSONContent,
} from 'novel';
import { handleCommandNavigation, ImageResizer } from 'novel/extensions';
import { handleImageDrop, handleImagePaste } from 'novel/plugins';
import { useDebouncedCallback } from 'use-debounce';

import { Separator } from '../ui/separator';

import { GenerativeMenuSwitch } from './generative/generative-menu-switch';
import { ColorSelector } from './selectors/color-selector';
import { LinkSelector } from './selectors/link-selector';
import { NodeSelector } from './selectors/node-selector';
import { TextButtons } from './selectors/text-buttons';
import { elementsExtensions } from './elements';
import { defaultExtensions } from './extensions';
import { uploadFn } from './image-upload';
import {
  graphSuggestions,
  slashCommand,
  SlashItem,
  suggestionItems,
  tableSuggestions,
} from './slash-command';

import './styles.css';

const extensions = [...defaultExtensions, slashCommand];

interface EditorProp {
  initialValue?: JSONContent;
  onChange: (_value: JSONContent) => void;
}

const CommandHeader = ({ children }: { children: string }) => {
  return (
    <span className="mb-2 ml-2 text-sm text-muted-foreground">{children}</span>
  );
};

const Editor = ({ initialValue, onChange }: EditorProp) => {
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();

      onChange(json);
    },
    1_000,
  );

  return (
    <EditorRoot>
      <EditorContent
        {...(initialValue && { initialContent: initialValue })}
        extensions={[...extensions, ...elementsExtensions]}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) =>
            handleImageDrop(view, event, moved, uploadFn),
          attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
        onUpdate={({ editor }) => {
          debouncedUpdates(editor);
        }}
        slotAfter={<ImageResizer />}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            Nema rezultata
          </EditorCommandEmpty>
          <EditorCommandList>
            <div className="flex flex-col gap-2">
              <div>
                <CommandHeader>Tekst</CommandHeader>
                {suggestionItems.map((item) => (
                  <SlashItem key={item.title} item={item} />
                ))}
              </div>
              <div>
                <CommandHeader>Grafovi</CommandHeader>
                {graphSuggestions.map((item) => (
                  <SlashItem key={item.title} item={item} />
                ))}
              </div>
              <div>
                <CommandHeader>Tablice</CommandHeader>
                {tableSuggestions.map((item) => (
                  <SlashItem key={item.title} item={item} />
                ))}
              </div>
            </div>
          </EditorCommandList>
        </EditorCommand>

        <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
          <Separator orientation="vertical" />
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <Separator orientation="vertical" />

          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <Separator orientation="vertical" />
          <TextButtons />
          <Separator orientation="vertical" />
          <ColorSelector open={openColor} onOpenChange={setOpenColor} />
        </GenerativeMenuSwitch>
      </EditorContent>
    </EditorRoot>
  );
};

export default Editor;
