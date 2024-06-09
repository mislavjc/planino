import { notFound } from 'next/navigation';

import { getBusinessPlan } from 'actions/plans';

import { EditorBlock } from 'components/@plans/content';

export const runtime = 'nodejs';

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
    <div className="mx-auto flex min-h-screen w-full max-w-screen-lg flex-col gap-8 border p-8">
      <EditorBlock businessPlan={businessPlan} organization={organization} />
    </div>
  );
};

export default BusinessPlanPage;
