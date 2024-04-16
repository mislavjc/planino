import { sql } from 'drizzle-orm';

export const YEARLY_EXPENSE_AGREGATION = sql`
WITH ExpenseData AS (
    SELECT
        t.team_id,
        e.expense_id,
        e.name AS expense_name,
        t.name AS team_name,
        e.created_at,
        EXTRACT(YEAR FROM fa.starting_month) AS start_year,
        EXTRACT(MONTH FROM fa.starting_month) AS start_month,
        fa.ending_month,
        fa.amount,
        fa.raise_percentage
    FROM
        team t
        INNER JOIN expense e ON t.team_id = e.team_id
        INNER JOIN financial_attribute fa ON fa.financial_attribute_id = e.financial_attribute_id
),
MinYear AS (
    SELECT
        MIN(start_year) AS min_year
    FROM
        ExpenseData
),
MonthlySums AS (
    SELECT
        team_id,
        expense_id,
        expense_name,
        team_name,
        created_at,
        start_year,
        start_month,
        ending_month,
        amount,
        raise_percentage,
        year,
        CASE
            WHEN year = start_year AND year = EXTRACT(YEAR FROM COALESCE(ending_month, CURRENT_DATE)) THEN EXTRACT(MONTH FROM COALESCE(ending_month, CURRENT_DATE)) - start_month + 1
            WHEN year = start_year THEN 12 - start_month + 1
            WHEN year = EXTRACT(YEAR FROM COALESCE(ending_month, CURRENT_DATE)) THEN EXTRACT(MONTH FROM COALESCE(ending_month, CURRENT_DATE))
            ELSE 12
        END as months_in_year
    FROM
        ExpenseData,
        generate_series((SELECT min_year FROM MinYear), (SELECT min_year FROM MinYear) + 4) as year
    WHERE
        year >= start_year AND 
        (ending_month IS NULL OR year <= EXTRACT(YEAR FROM ending_month))
),
AdjustedAmounts AS (
    SELECT
        team_id,
        expense_id,
        expense_name,
        team_name,
        year,
        created_at,
        SUM(amount * months_in_year * POWER(1 + COALESCE(raise_percentage, 0) / 100, year - start_year)) AS total_amount
    FROM
        MonthlySums
    GROUP BY
        team_id, expense_id, expense_name, team_name, year, created_at
)
SELECT
    team_id,
    expense_id,
    expense_name,
    team_name,
    year AS financial_year,
    total_amount
FROM
    AdjustedAmounts
ORDER BY
    created_at;
`;
