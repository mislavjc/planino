'use client';

import { updateBlock } from 'actions/block';

import { BlockWrapper } from 'components/@block/wrapper';
import Editor from 'components/editor/advanced-editor';
import { JSONContentSchema } from 'components/editor/schema';

export const EditorBlock = ({
  content,
  blockId,
  organization,
}: {
  content: unknown;
  blockId: string;
  organization: string;
}) => {
  if (content === null) {
    return (
      <BlockWrapper blockId={blockId} organization={organization}>
        <Editor
          initialValue={undefined}
          onChange={(_value) => {
            updateBlock({ blockId, content: JSON.stringify(_value) });
          }}
        />
      </BlockWrapper>
    );
  }

  const parsedContent = JSONContentSchema.parse(content);

  return (
    <BlockWrapper blockId={blockId} organization={organization}>
      <Editor
        initialValue={parsedContent}
        onChange={(_value) => {
          updateBlock({ blockId, content: JSON.stringify(_value) });
        }}
      />
    </BlockWrapper>
  );
};
