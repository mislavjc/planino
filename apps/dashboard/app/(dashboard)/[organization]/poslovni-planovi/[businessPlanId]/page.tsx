import { Plus } from 'lucide-react';
import { notFound } from 'next/navigation';

import { createBlock } from 'actions/block';
import { getBusinessPlan } from 'actions/plans';

import { EditorBlock } from 'components/@plans/content';
import { Button } from 'components/ui/button';

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

  return (
    <div className="mx-auto w-full max-w-screen-lg border p-8">
      {businessPlan.blocks.map((block) => (
        <EditorBlock
          key={block.blockId}
          blockId={block.blockId}
          content={block.content}
        />
      ))}
      <form action={createBlock}>
        <input
          type="hidden"
          name="business_plan_id"
          value={businessPlan.businessPlanId}
        />
        <Button className="mt-8 w-full" variant="outline">
          <Plus />
          Dodaj blok
        </Button>
      </form>
    </div>
  );
};

export default BusinessPlanPage;
