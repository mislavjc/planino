import { notFound } from 'next/navigation';

import { getBusinessPlan } from 'actions/plans';

import { AddBlock } from 'components/@plans/add-block';
import { EditorBlock } from 'components/@plans/content';
import { RenderBlock } from 'components/@plans/render-block';

import { getBlockFromOptions, getBlockOptions } from 'lib/blocks';

const BusinessPlanPage = async ({
  params: { businessPlanId, organization },
}: {
  params: {
    businessPlanId: string;
    organization: string;
  };
}) => {
  const businessPlan = await getBusinessPlan({
    organization,
    businessPlanId,
  });

  if (!businessPlan) {
    notFound();
  }

  const blockOptions = await getBlockOptions(organization);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-screen-lg flex-col gap-8 border p-8">
      {businessPlan.blocks.map((block) => {
        return block.type === 'text' ? (
          <EditorBlock
            key={block.blockId}
            blockId={block.blockId}
            content={block.content}
          />
        ) : (
          <RenderBlock
            key={block.blockId}
            content={block.content}
            organization={organization}
          />
        );
      })}
      <div>
        <AddBlock
          organization={organization}
          blockOptions={blockOptions}
          businessPlanId={businessPlanId}
        />
      </div>
    </div>
  );
};

export default BusinessPlanPage;
