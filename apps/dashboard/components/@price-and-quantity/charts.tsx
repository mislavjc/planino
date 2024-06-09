import { AreaChart } from '@planino/charts';

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
      <AreaChart
        data={product}
        className="h-[50vh]"
        index="month"
        type="stacked"
        categories={
          product.length > 0
            ? Object.keys(product[0]).filter((key) => key !== 'month')
            : []
        }
      />
    </div>
  );
};
