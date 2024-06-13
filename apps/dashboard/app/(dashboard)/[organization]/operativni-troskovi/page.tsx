import { Suspense } from 'react';

import { createExpense, getOperationalExpenses } from 'actions/expense';

import { Charts } from 'components/@expenses/charts';
import { Overview } from 'components/@expenses/overview';
import { Row } from 'components/@expenses/row';
import { AddRow } from 'components/add-row';
import { TeamInputTable } from 'components/table/team-input-table';
import { Card, CardContent, CardHeader } from 'components/ui/card';
import { ScrollArea, ScrollBar } from 'components/ui/scroll-area';
import { TypographyH3 } from 'components/ui/typography';

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
        <CardContent>
          <ScrollArea className="min-w-[40rem]">
            <TeamInputTable
              header={[
                { title: 'Naziv', width: 2 },
                { title: 'Početak obračuna' },
                { title: 'Kraj obračuna' },
                { title: 'Mjesečni iznos troška', align: 'right' },
                { title: 'Postotak rasta g/g', align: 'right' },
              ]}
              teams={operationalExpenses.map((team) => {
                return {
                  teamId: team.teamId,
                  name: team.name,
                  items: team.expenses.map((expense) => (
                    <Row
                      key={`${expense.expenseId}-${expense.updatedAt}`}
                      expense={expense}
                    />
                  )),
                  add: (
                    <AddRow
                      action={async () => {
                        'use server';

                        await createExpense({
                          organization,
                          teamId: team.teamId,
                        });
                      }}
                    />
                  ),
                };
              })}
            />
            <ScrollBar />
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Troškovi po timovima</TypographyH3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Suspense>
            <Charts organization={organization} />
          </Suspense>
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
