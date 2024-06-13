import Link from 'next/link';

import {
  createProduct,
  createProductGroup,
  getAllProducts,
} from 'actions/product';

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
        <CardContent className="flex flex-col gap-4">
          {productGroups.map((productGroup) => (
            <div key={productGroup.productGroupId} className="flex flex-col">
              <GroupName productGroup={productGroup} />
              <div className="grid grid-cols-3 divide-x-[1px] border border-t-0">
                {productGroup.products.map((product) => (
                  <Link
                    key={`${product.productId}+${product.priceHistory.length}`}
                    href={`/${organization}/cijena-i-kolicina/${product.productId}`}
                    className={cn('p-4 rounded-lg', {
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
                  className={cn('h-full border-0', {
                    'col-span-2': productGroup.products.length % 3 === 1,
                    'col-span-3':
                      (productGroup.products.length % 3 === 1 &&
                        productGroup.products.length !== 1) ||
                      productGroup.products.length === 0,
                  })}
                  fullHeight
                  border={false}
                >
                  Dodaj proizvod
                </AddRow>
              </div>
            </div>
          ))}
          <AddRow
            action={async () => {
              'use server';

              await createProductGroup({ organization });
            }}
          >
            Dodaj grupu proizvoda
          </AddRow>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceAndQuantityPage;
