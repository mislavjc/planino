import { BarStackChart } from '@planino/charts';

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
    <div>
      <TypographyH3>Troškovi po godinama</TypographyH3>
      <div className="h-[60vh]">
        <BarStackChart data={expenses[0].values} domainKey="year" />
      </div>
      <TypographyH3>Troškovi po odjelima</TypographyH3>
      <div className="grid lg:grid-cols-2">
        {expensesByTeam.map((team) => (
          <div key={team.team_name}>
            <TypographyH4>{team.team_name}</TypographyH4>
            <div className="h-[60vh]">
              <BarStackChart
                key={team.team_name}
                data={team.values}
                domainKey="year"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensesPage;
