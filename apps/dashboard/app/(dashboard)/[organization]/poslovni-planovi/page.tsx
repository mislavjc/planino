import Link from 'next/link';

import { createBusinessPlan, getBusinessPlans } from 'actions/plans';

import { Card, CardContent, CardHeader } from 'ui/card';
import { TypographyH3, TypographyP } from 'ui/typography';

const BusinessPlans = async ({
  params,
}: {
  params: {
    organization: string;
  };
}) => {
  const businessPlans = await getBusinessPlans(params.organization);

  return (
    <div>
      <Card>
        <CardHeader>
          <TypographyH3>Poslovni planovi</TypographyH3>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {businessPlans.map((plan, index) => (
              <Link
                href={`/${params.organization}/poslovni-planovi/${plan.businessPlanId}`}
                key={plan.businessPlanId}
                className="flex h-72 cursor-pointer items-center justify-center rounded-lg border-2 transition-all duration-100 ease-in-out hover:bg-muted/40"
              >
                <TypographyP className="text-sm text-neutral-600">
                  {plan.name || `Bez naziva #${index + 1}`}
                </TypographyP>
              </Link>
            ))}
            <form
              className="relative flex h-72 items-center justify-center rounded-lg border-2 border-dashed bg-muted/40 transition-all duration-100 ease-in-out hover:bg-muted/10"
              action={createBusinessPlan}
            >
              <button className="absolute inset-0">
                <input
                  type="hidden"
                  name="organization"
                  value={params.organization}
                />
                <TypographyP className="text-sm text-neutral-600">
                  Kreiraj novi poslovni plan
                </TypographyP>
              </button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessPlans;
