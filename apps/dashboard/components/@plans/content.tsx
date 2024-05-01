'use client';

import { updateBlock } from 'actions/block';

import { BlockWrapper } from 'components/@block/wrapper';
import Editor from 'components/editor/advanced-editor';
import { documentSchema } from 'components/editor/schema';

export const EditorBlock = ({
  content,
  blockId,
}: {
  content: unknown;
  blockId: string;
}) => {
  if (content === null) {
    return (
      <Editor
        initialValue={undefined}
        onChange={(_value) => {
          updateBlock({ blockId, content: JSON.stringify(_value) });
        }}
      />
    );
  }

  const parsedContent = documentSchema.parse(content);

  return (
    <BlockWrapper blockId={blockId}>
      <Editor
        initialValue={parsedContent}
        onChange={(_value) => {
          updateBlock({ blockId, content: JSON.stringify(_value) });
        }}
      />
    </BlockWrapper>
  );
};
