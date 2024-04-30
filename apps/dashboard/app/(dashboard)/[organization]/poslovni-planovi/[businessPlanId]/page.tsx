import { notFound } from 'next/navigation';

import { getBusinessPlan } from 'actions/plans';

import { Content } from 'components/@plans/content';

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
    <div>
      <Content />
    </div>
  );
};

export default BusinessPlanPage;
