import { getYearlyExpenseAggregation } from 'actions/expense';

import { TypographyH4, TypographyP } from 'ui/typography';

export const Overview = async ({ organization }: { organization: string }) => {
  const aggregation = await getYearlyExpenseAggregation(organization);

  return (
    <div className="p-4">
      {aggregation.map(({ year, groups }) => (
        <div key={year}>
          <TypographyP className="bg-muted px-2 py-1 text-center font-mono">
            {year}
          </TypographyP>
          {groups.map(({ grouped_expense_id, expenses }) => (
            <div key={grouped_expense_id}>
              <TypographyP>{grouped_expense_id}</TypographyP>
              {expenses.map((expense) => (
                <div key={expense.expense_id} className="flex justify-between">
                  <TypographyP>{expense.expense_name}</TypographyP>
                  <TypographyP className="font-mono">
                    {Intl.NumberFormat('hr-HR', {
                      style: 'currency',
                      currency: 'eur',
                    }).format(Number(expense.total_amount))}
                  </TypographyP>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
