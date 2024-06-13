import React, { Suspense } from 'react';
import { Metadata } from 'next';

import { createLoan, getLoans } from 'actions/loan';

import { Card, CardContent, CardHeader } from 'ui/card';
import { ScrollArea, ScrollBar } from 'ui/scroll-area';
import { TypographyH3, TypographyP } from 'ui/typography';

import { Charts } from 'components/@loans/charts';
import { Overview } from 'components/@loans/overview';
import { Row } from 'components/@loans/row';
import { AddRow } from 'components/add-row';

import { cn } from 'lib/utils';

export const metadata: Metadata = {
  title: 'Otplatni plan - Planino',
};

const PaymentPlanPage = async ({
  params: { organization },
}: {
  params: {
    organization: string;
  };
}) => {
  const loans = await getLoans(organization);

  return (
    <div className="flex flex-col gap-2">
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Otplatni plan</TypographyH3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <ScrollArea className="min-w-[40rem]">
            <div>
              <div className="grid grid-cols-7 divide-x-[1px] border bg-muted">
                {['Naziv', 'Kamata', 'Broj rata', 'Iznos', 'Prvi mjesec'].map(
                  (title, index) => (
                    <TypographyP
                      key={title}
                      className={cn('p-2 pl-6 pr-6 text-sm', {
                        'col-span-2': title === 'Naziv',
                      })}
                    >
                      {title}
                    </TypographyP>
                  ),
                )}
              </div>
              <div className="divide-y-[1px]">
                {loans.map((loan) => (
                  <Row key={`${loan.loanId}-${loan.updatedAt}`} {...loan} />
                ))}
              </div>
              <AddRow
                action={async () => {
                  'use server';

                  await createLoan(organization);
                }}
              />
            </div>
            <ScrollBar />
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Otplatni planovi</TypographyH3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Suspense>
            <Charts organization={organization} />
          </Suspense>
        </CardContent>
      </Card>
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Izračun</TypographyH3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <ScrollArea className="w-max">
            <Suspense fallback={null}>
              <Overview organization={organization} />
            </Suspense>
            <ScrollBar />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPlanPage;
