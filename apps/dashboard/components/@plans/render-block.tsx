import { blockOptionsSchema, getBlockFromOptions } from 'lib/blocks';

export const RenderBlock = async ({
  content,
  organization,
}: {
  content: unknown;
  organization: string;
}) => {
  const parsedContent = blockOptionsSchema.parse(content);

  const block = await getBlockFromOptions(parsedContent, organization);

  if (!block) {
    return null;
  }

  return block;
};
