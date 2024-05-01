import { BlockWrapper } from 'components/@block/wrapper';

import { blockOptionsSchema, getBlockFromOptions } from 'lib/blocks';

export const RenderBlock = async ({
  content,
  organization,
  blockId,
}: {
  content: unknown;
  organization: string;
  blockId: string;
}) => {
  const parsedContent = blockOptionsSchema.parse(content);

  const block = await getBlockFromOptions(parsedContent, organization);

  if (!block) {
    return null;
  }

  return (
    <BlockWrapper blockId={blockId} organization={organization}>
      {block}
    </BlockWrapper>
  );
};
