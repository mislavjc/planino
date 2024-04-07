import { getOperationalExpenses } from 'actions/expense';

import { AddRow } from 'components/@expenses/add-row';
import { Input } from 'components/ui/input';

const OperationalExpensesPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const operationalExpenses = await getOperationalExpenses(organization);

  return (
    <div>
      <div className="flex flex-col gap-4">
        {operationalExpenses.map((team) => (
          <div key={team.teamId}>
            <div className="bg-muted px-4 py-2 font-mono text-sm uppercase">
              {team.name}
            </div>
            {team.expenses.map((expense) => (
              <div key={expense.expenseId}>
                <Input placeholder="Nabavka materijala" />
              </div>
            ))}
            <AddRow organization={organization} teamId={team.teamId} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationalExpensesPage;
