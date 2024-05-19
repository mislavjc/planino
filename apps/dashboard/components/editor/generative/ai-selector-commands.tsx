import {
  ArrowDownWideNarrow,
  CheckCheck,
  RefreshCcwDot,
  StepForward,
  WrapText,
} from 'lucide-react';
import { useEditor } from 'novel';
import { getPrevText } from 'novel/utils';

import { CommandGroup, CommandItem, CommandSeparator } from 'ui/command';

const options = [
  {
    value: 'improve',
    label: 'Poboljšaj tekst',
    icon: RefreshCcwDot,
  },

  {
    value: 'fix',
    label: 'Popravi greške',
    icon: CheckCheck,
  },
  {
    value: 'shorter',
    label: 'Skrati',
    icon: ArrowDownWideNarrow,
  },
  {
    value: 'longer',
    label: 'Produlji',
    icon: WrapText,
  },
];

interface AISelectorCommandsProps {
  onSelect: (_value: string, _option: string) => void;
}

export const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor();

  return (
    <>
      <CommandGroup heading="Uredi ili pregledaj odabrano">
        {options.map((option) => (
          <CommandItem
            onSelect={(value) => {
              const slice = editor?.state.selection.content();
              const text = editor?.storage.markdown.serializer.serialize(
                slice?.content,
              );
              onSelect(text, value);
            }}
            className="flex gap-2 px-4"
            key={option.value}
            value={option.value}
          >
            <option.icon className="size-4 text-purple-500" />
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Koristi AI za više">
        <CommandItem
          onSelect={() => {
            const pos = editor?.state.selection.from ?? 0;

            const text = getPrevText(editor!, pos);
            onSelect(text, 'continue');
          }}
          value="continue"
          className="gap-2 px-4"
        >
          <StepForward className="size-4 text-purple-500" />
          Nastavi pisati
        </CommandItem>
      </CommandGroup>
    </>
  );
};
