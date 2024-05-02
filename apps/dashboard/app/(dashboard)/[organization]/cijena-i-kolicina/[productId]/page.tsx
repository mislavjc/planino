import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getProduct } from 'actions/product';

import { TypographyH3 } from 'ui/typography';

import { Charts } from 'components/@price-and-quantity/charts';
import { Entry } from 'components/@price-and-quantity/entry';
import { Card, CardContent, CardHeader } from 'components/ui/card';

import { cn } from 'lib/utils';

const ProductPage = async ({
  params: { organization, productId },
}: {
  params: { organization: string; productId: string };
}) => {
  const product = await getProduct({ organization, productId });

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="max-w-screen-md">
        <CardHeader>
          <TypographyH3
            className={cn({
              'text-muted-foreground/60': !product.name,
            })}
          >
            {product.name ?? 'Neimenovani proizvod'}
          </TypographyH3>
        </CardHeader>
        <CardContent>
          <Entry product={product} />
        </CardContent>
      </Card>
      <Card className="max-w-screen-md">
        <CardHeader>
          <TypographyH3>Pregled</TypographyH3>
        </CardHeader>
        <CardContent>
          <Suspense>
            <Charts organization={organization} productId={productId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductPage;
