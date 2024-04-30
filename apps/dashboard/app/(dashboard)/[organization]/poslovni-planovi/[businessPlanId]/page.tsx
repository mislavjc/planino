import { notFound } from 'next/navigation';

import { getBusinessPlan } from 'actions/plans';

import { AddBlock } from 'components/@plans/add-block';
import { EditorBlock } from 'components/@plans/content';

import { getBlockOptions } from 'lib/blocks';

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
      {businessPlan.blocks.map((block) => (
        <EditorBlock
          key={block.blockId}
          blockId={block.blockId}
          content={block.content}
        />
      ))}
      <div>
        <AddBlock blockOptions={blockOptions} />
      </div>
    </div>
  );
};

export default BusinessPlanPage;
