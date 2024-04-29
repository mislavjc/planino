interface ExpenseData {
  team_name: string;
  item_name: string;
  yearly_values: (number | null)[];
}

interface ExpenseAggregation {
  values: ExpenseData[];
  years: string[];
  numberOfYears: number;
}

interface TransformedExpenseRecord {
  year: string;
  [key: string]: string;
}

interface TransformedTeamRecord {
  name: string;
  values: TransformedExpenseRecord[];
}

export const transformAggregateValues = (
  data: ExpenseAggregation,
): TransformedTeamRecord[] => {
  const teams: { [teamName: string]: TransformedExpenseRecord[] } = {};

  data.values.forEach(({ team_name, item_name }) => {
    if (!teams[team_name]) {
      teams[team_name] = data.years.map((year) => {
        const record = { year };
        return record;
      });
    }
    teams[team_name].forEach((record) => {
      record[item_name] = '0';
    });
  });

  data.values.forEach(({ team_name, item_name, yearly_values }) => {
    yearly_values.forEach((value, index) => {
      if (teams[team_name] && teams[team_name][index]) {
        const expenseRecord = teams[team_name][index];
        expenseRecord[item_name] = value !== null ? value.toString() : '0';
      }
    });
  });

  const transformedTeams = Object.keys(teams).map((teamName) => ({
    name: teamName,
    values: teams[teamName],
  }));

  return transformedTeams;
};
