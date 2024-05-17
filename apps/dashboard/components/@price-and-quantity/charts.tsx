import { BarStackChart } from '@planino/charts';

import { getProductAggregations } from 'actions/product';

export const Charts = async ({
  organization,
  productId,
}: {
  organization: string;
  productId: string;
}) => {
  const product = await getProductAggregations({ organization, productId });

  return (
    <div className="h-[50vh]">
      <BarStackChart data={product} domainKey="month" />
    </div>
  );
};
