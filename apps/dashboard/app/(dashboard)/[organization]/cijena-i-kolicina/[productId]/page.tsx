import { notFound } from 'next/navigation';

import { getProduct } from 'actions/product';

import { TypographyH3 } from 'ui/typography';

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
    <div>
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
    </div>
  );
};

export default ProductPage;
