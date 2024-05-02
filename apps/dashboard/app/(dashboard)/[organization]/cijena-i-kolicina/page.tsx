import { createProduct, getAllProducts } from 'actions/product';

import { Entry } from 'components/@price-and-quantity/entry';
import { AddRow } from 'components/add-row';
import { Card, CardContent, CardHeader } from 'components/ui/card';
import { TypographyH3 } from 'components/ui/typography';

const PriceAndQuantityPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const productGroups = await getAllProducts(organization);

  return (
    <div>
      <Card className="max-w-screen-md">
        <CardHeader>
          <TypographyH3>Unos</TypographyH3>
        </CardHeader>
        <CardContent>
          {productGroups.map((productGroup) =>
            productGroup.products.map((product) => (
              <Entry
                key={`${product.productId}-${product.priceHistory.length}`}
                product={product}
              />
            )),
          )}
          <div>wowow</div>
          <AddRow
            action={async () => {
              'use server';

              await createProduct({
                organization,
                group: productGroups[0].productGroupId,
              });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceAndQuantityPage;
