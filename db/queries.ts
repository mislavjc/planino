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

export const INVENTORY_VALUES = (organzation_id: string) => sql`
WITH YearValues AS (
    SELECT 
        i.inventory_item_id,
        i.name AS item_name,
        i.value / i.amortization_length AS yearly_amortization,
        EXTRACT(YEAR FROM i.starting_month) AS start_year,
        i.amortization_length,
        i.team_id
    FROM 
        inventory_item i
        JOIN team t ON i.team_id = t.team_id
    WHERE
        t.organization_id = ${organzation_id}
),
MinMaxYears AS (
    SELECT 
        MIN(EXTRACT(YEAR FROM starting_month)) AS min_year,
        MAX(EXTRACT(YEAR FROM starting_month) + amortization_length - 1) AS max_year
    FROM 
        inventory_item
),
TeamItems AS (
    SELECT
        t.name AS team_name,
        y.item_name,
        y.yearly_amortization,
        y.start_year,
        y.amortization_length,
        y.team_id,
        m.min_year,
        m.max_year
    FROM
        team t
        JOIN YearValues y ON t.team_id = y.team_id
        CROSS JOIN MinMaxYears m
        WHERE
            t.organization_id = ${organzation_id}
)
SELECT
    t.team_name,
    t.item_name,
    ARRAY_AGG(
        CASE 
            WHEN t.start_year <= y AND t.start_year + t.amortization_length - 1 >= y THEN t.yearly_amortization
            ELSE NULL
        END ORDER BY y
    ) FILTER (WHERE y BETWEEN t.min_year AND t.max_year) AS yearly_values
FROM
    TeamItems t,
    generate_series(t.min_year, t.max_year) AS y
GROUP BY
    t.team_name, t.item_name
ORDER BY
    t.team_name, t.item_name;
`;
