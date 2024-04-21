import { Suspense } from 'react';

import { createExpense, getOperationalExpenses } from 'actions/expense';

import { Overview } from 'components/@expenses/overview';
import { Row } from 'components/@expenses/row';
import { AddRow } from 'components/add-row';
import { Card, CardContent, CardHeader } from 'components/ui/card';
import { ScrollArea, ScrollBar } from 'components/ui/scroll-area';
import { TypographyH3, TypographyP } from 'components/ui/typography';

const OperationalExpensesPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const operationalExpenses = await getOperationalExpenses(organization);

  return (
    <div className="flex flex-col gap-4">
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Operativni troškovi</TypographyH3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <ScrollArea className="min-w-[40rem]">
            <div>
              <div className="grid grid-cols-6 text-sm">
                <TypographyP className="col-span-2">Naziv</TypographyP>
                <TypographyP>Mjesec početka obračuna</TypographyP>
                <TypographyP>Mjesec kraja obračuna</TypographyP>
                <TypographyP className="text-right">
                  Mjesečni iznos troška
                </TypographyP>
                <TypographyP className="text-right">
                  Postotak rasta g/g
                </TypographyP>
              </div>
              <div className="flex flex-col gap-4">
                {operationalExpenses.map((team) => (
                  <div key={team.teamId}>
                    <div className="bg-muted px-4 py-2 font-mono text-sm uppercase">
                      {team.name}
                    </div>
                    {team.expenses.map((expense) => (
                      <div key={expense.expenseId}>
                        <Row expense={expense} />
                      </div>
                    ))}
                    <AddRow
                      action={async () => {
                        'use server';

                        await createExpense({
                          organization,
                          teamId: team.teamId,
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <ScrollBar />
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Pregled</TypographyH3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <ScrollArea className="w-max">
            <Suspense>
              <Overview organization={organization} />
            </Suspense>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperationalExpensesPage;
