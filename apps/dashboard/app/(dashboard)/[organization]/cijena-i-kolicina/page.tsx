import Link from 'next/link';

import { createProduct, getAllProducts } from 'actions/product';

import { GroupName } from 'components/@price-and-quantity/group-name';
import { AddRow } from 'components/add-row';
import { Card, CardContent, CardHeader } from 'components/ui/card';
import { TypographyH3 } from 'components/ui/typography';
import { cn } from 'lib/utils';

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
          <TypographyH3>Proizvodi</TypographyH3>
        </CardHeader>
        <CardContent>
          {productGroups.map((productGroup) => (
            <div key={productGroup.productGroupId} className="flex flex-col">
              <GroupName productGroup={productGroup} />
              <div className="grid grid-cols-3">
                {productGroup.products.map((product) => (
                  <Link
                    key={`${product.productId}+${product.priceHistory.length}`}
                    href={`/${organization}/cijena-i-kolicina/${product.productId}`}
                    className={cn('border border-gray-200 p-4 rounded-lg', {
                      'text-muted-foreground/60': !product.name,
                    })}
                  >
                    {product.name ?? 'Neimenovan proizvod'}
                  </Link>
                ))}
                <AddRow
                  action={async () => {
                    'use server';

                    await createProduct({
                      organization,
                      group: productGroup.productGroupId,
                    });
                  }}
                  className="h-full"
                  fullHeight
                >
                  Dodaj proizvod
                </AddRow>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceAndQuantityPage;
