import { getProductAggregations } from 'actions/product';

import { BarStackChart } from 'components/@charts/bar-stack';

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
      <BarStackChart data={product} />
    </div>
  );
};
