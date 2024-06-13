import { BarChart } from '@planino/charts';

import { getExpenses, getExpensesPerTeam } from 'actions/output';

import { TypographyH3, TypographyH4 } from 'components/ui/typography';

const ExpensesPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const expensesByTeam = await getExpensesPerTeam(organization);
  const expenses = await getExpenses(organization);

  return (
    <div className="flex flex-col gap-4">
      <TypographyH3>Troškovi po godinama</TypographyH3>
      <div className="h-[60vh]">
        <BarChart
          data={
            expenses.length > 0 ? expenses[0].values : [{ year: 0, value: 0 }]
          }
          className="h-[50vh]"
          index="year"
          categories={
            expenses.length > 0
              ? Object.keys(expenses[0].values[0]).filter(
                  (key) => key !== 'year',
                )
              : []
          }
        />
      </div>
      <TypographyH3>Troškovi po odjelima</TypographyH3>
      <div className="grid lg:grid-cols-2">
        {expensesByTeam.map((team) => (
          <div key={team.team_name}>
            <TypographyH4>{team.team_name}</TypographyH4>
            <div className="h-[60vh]">
              <BarChart
                key={team.team_name}
                data={team.values}
                className="h-[50vh]"
                index="year"
                type="stacked"
                categories={
                  team.values.length > 0
                    ? Object.keys(team.values[0]).filter(
                        (key) => key !== 'year',
                      )
                    : []
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensesPage;
