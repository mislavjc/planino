import { sql } from 'drizzle-orm';

export const YEARLY_EXPENSE_AGREGATION = (organization_id: string) => sql`
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
    WHERE
        t.organization_id = ${organization_id} AND
        e.name IS NOT NULL AND
        e.name <> ''
),
MinYear AS (
    SELECT
        MIN(start_year) AS min_year
    FROM
        ExpenseData
),
MaxYear AS (
    SELECT
        MAX(COALESCE(EXTRACT(YEAR FROM ending_month), EXTRACT(YEAR FROM CURRENT_DATE))) AS max_year
    FROM
        ExpenseData
),
MonthlySums AS (
    SELECT
        ed.team_id,
        ed.expense_id,
        ed.expense_name,
        ed.team_name,
        ed.created_at,
        ed.start_year,
        ed.start_month,
        ed.ending_month,
        ed.amount,
        ed.raise_percentage,
        gs.year,
        CASE
            WHEN gs.year = ed.start_year AND gs.year = EXTRACT(YEAR FROM COALESCE(ed.ending_month, CURRENT_DATE)) THEN EXTRACT(MONTH FROM COALESCE(ed.ending_month, CURRENT_DATE)) - ed.start_month + 1
            WHEN gs.year = ed.start_year THEN 12 - ed.start_month + 1
            WHEN gs.year = EXTRACT(YEAR FROM COALESCE(ed.ending_month, CURRENT_DATE)) THEN EXTRACT(MONTH FROM COALESCE(ed.ending_month, CURRENT_DATE))
            ELSE 12
        END as months_in_year
    FROM
        ExpenseData ed,
        generate_series((SELECT min_year FROM MinYear), (SELECT max_year FROM MaxYear)) as gs(year)
    WHERE
        gs.year >= ed.start_year AND 
        (ed.ending_month IS NULL OR gs.year <= EXTRACT(YEAR FROM ed.ending_month))
),
AdjustedAmounts AS (
    SELECT
        ms.team_id,
        ms.expense_id,
        ms.expense_name,
        ms.team_name,
        ms.year,
        ms.created_at,
        ms.amount * ms.months_in_year * POWER(1 + COALESCE(ms.raise_percentage, 0) / 100, ms.year - ms.start_year) AS year_amount
    FROM
        MonthlySums ms
)
SELECT
    ed.team_name,
    ed.expense_name AS item_name,
    ARRAY(
        SELECT COALESCE(aa.year_amount, NULL)
        FROM generate_series((SELECT min_year FROM MinYear), (SELECT max_year FROM MaxYear)) AS gs(year)
        LEFT JOIN AdjustedAmounts aa ON aa.year = gs.year AND aa.expense_id = ed.expense_id
        ORDER BY gs.year
    ) AS yearly_values,
    ed.created_at
FROM
    ExpenseData ed
GROUP BY
    ed.team_id, ed.expense_id, ed.team_name, ed.expense_name, ed.created_at
ORDER BY
    ed.created_at;

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
