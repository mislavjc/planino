import {
  BarChart,
  CheckSquare,
  Component,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  Table,
  Text,
  TextQuote,
} from 'lucide-react';
import { EditorCommandItem } from 'novel';
import { createSuggestionItems, SuggestionItem } from 'novel/extensions';
import { Command, renderItems } from 'novel/extensions';

import { elements } from './elements/registry';
import { uploadFn } from './image-upload';

export const suggestionItems = createSuggestionItems([
  {
    title: 'Tekst',
    description: 'Tekst obične veličine.',
    searchTerms: ['p', 'paragraph'],
    icon: <Text size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode('paragraph', 'paragraph')
        .run();
    },
  },
  {
    title: 'To-do lista',
    description: 'Izradite listu zadataka.',
    searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: 'Naslov 1',
    description: 'Veliki naslov odjeljka',
    searchTerms: ['title', 'big', 'large'],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run();
    },
  },
  {
    title: 'Naslov 2',
    description: 'Srednji naslov odjeljka.',
    searchTerms: ['subtitle', 'medium'],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run();
    },
  },
  {
    title: 'Naslov 3',
    description: 'Mali naslov odjeljka.',
    searchTerms: ['subtitle', 'small'],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run();
    },
  },
  {
    title: 'Popis bez poretka',
    description: 'Izradite listu bez numeriranja.',
    searchTerms: ['unordered', 'point'],
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numerirana lista',
    description: 'Izradite listu s numeriranjem.',
    searchTerms: ['ordered'],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Citat',
    description: 'Dodajte citat u tekst.',
    searchTerms: ['blockquote'],
    icon: <TextQuote size={18} />,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode('paragraph', 'paragraph')
        .toggleBlockquote()
        .run(),
  },
  {
    title: 'Slika',
    description: 'Učitajte sliku s Vašeg računala.',
    searchTerms: ['photo', 'picture', 'media'],
    icon: <ImageIcon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          const pos = editor.view.state.selection.from;
          uploadFn(file, editor.view, pos);
        }
      };
      input.click();
    },
  },
  {
    title: 'React Component',
    description: 'Insert a custom React component.',
    searchTerms: ['react', 'component'],
    icon: <Component size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'reactComponent',
          attrs: { count: 0 },
        })
        .run();
    },
  },
]);

export const graphSuggestions = createSuggestionItems([
  {
    title: 'Troškovi',
    description: 'Stupičasti graf troškova.',
    searchTerms: ['graph', 'chart'],
    icon: <BarChart size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: elements.expensesBarChart,
        })
        .run();
    },
  },
  {
    title: 'Krediti',
    description: 'Stupičasti graf kredita.',
    searchTerms: ['graph', 'chart'],
    icon: <BarChart size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'loansBarChart',
        })
        .run();
    },
  },
  {
    title: 'Inventar',
    description: 'Stupičasti graf inventara.',
    searchTerms: ['graph', 'chart'],
    icon: <BarChart size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'inventoryBarChart',
        })
        .run();
    },
  },
  {
    title: 'Odjeli',
    description: 'Stupičasti graf odjela.',
    searchTerms: ['graph', 'chart'],
    icon: <BarChart size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'teamBarChart',
        })
        .run();
    },
  },
]);

export const tableSuggestions = createSuggestionItems([
  {
    title: 'Troškovi - Godišnji pregled',
    description: 'Prikazuje godišnje troškove po kategorijama',
    searchTerms: ['table', 'overview'],
    icon: <Table size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'expensesOverviewTable',
        })
        .run();
    },
  },
  {
    title: 'Krediti - Godišnji pregled',
    description: 'Prikazuje godišnje kredite po kategorijama',
    searchTerms: ['table', 'overview'],
    icon: <Table size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'loansOverviewTable',
        })
        .run();
    },
  },
  {
    title: 'Inventar - Godišnji pregled',
    description: 'Prikazuje godišnji inventar po kategorijama',
    searchTerms: ['table', 'overview'],
    icon: <Table size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'inventoryOverviewTable',
        })
        .run();
    },
  },
  {
    title: 'Odjeli - Godišnji pregled',
    description: 'Prikazuje godišnje odjele po kategorijama',
    searchTerms: ['table', 'overview'],
    icon: <Table size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'teamOverviewTable',
        })
        .run();
    },
  },
]);

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});

export const SlashItem = ({ item }: { item: SuggestionItem }) => {
  return (
    <EditorCommandItem
      value={item.title}
      onCommand={(val) => item.command?.(val)}
      className={`hover:bg-accent aria-selected:bg-accent flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm `}
      key={item.title}
    >
      <div className="border-muted bg-background flex size-10 items-center justify-center rounded-md border">
        {item.icon}
      </div>
      <div>
        <p className="font-medium">{item.title}</p>
        <p className="text-muted-foreground text-xs">{item.description}</p>
      </div>
    </EditorCommandItem>
  );
};
