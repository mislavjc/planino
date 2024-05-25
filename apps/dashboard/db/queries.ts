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
            WHEN gs.year = ed.start_year AND gs.year = EXTRACT(YEAR FROM COALESCE(ed.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) THEN EXTRACT(MONTH FROM COALESCE(ed.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) - ed.start_month + 1
            WHEN gs.year = ed.start_year THEN 12 - ed.start_month + 1
            WHEN gs.year = EXTRACT(YEAR FROM COALESCE(ed.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) THEN EXTRACT(MONTH FROM COALESCE(ed.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day'))
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
    ed.team_name, ed.expense_name, ed.created_at;
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
    AND i.name <> ''
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

export const YEARLY_SALARY_AGREGATION = (organization_id: string) => sql`
WITH MemberData AS (
    SELECT
        t.team_id,
        m.member_id,
        m.name AS member_name,
        t.name AS team_name,
        m.created_at,
        EXTRACT(YEAR FROM m.starting_month) AS start_year,
        EXTRACT(MONTH FROM m.starting_month) AS start_month,
        m.ending_month,
        m.salary AS amount,
        m.raise_percentage
    FROM
        team t
        INNER JOIN member m ON t.team_id = m.team_id
    WHERE
        t.organization_id = ${organization_id} AND
        m.name IS NOT NULL AND
        m.name <> ''
),
MinYear AS (
    SELECT
        MIN(start_year) AS min_year
    FROM
        MemberData
),
MaxYear AS (
    SELECT
        MAX(COALESCE(EXTRACT(YEAR FROM ending_month), EXTRACT(YEAR FROM CURRENT_DATE))) AS max_year
    FROM
        MemberData
),
MonthlySums AS (
    SELECT
        md.team_id,
        md.member_id,
        md.member_name,
        md.team_name,
        md.created_at,
        md.start_year,
        md.start_month,
        md.ending_month,
        md.amount,
        md.raise_percentage,
        gs.year,
        CASE
            WHEN gs.year = md.start_year AND gs.year = EXTRACT(YEAR FROM COALESCE(md.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) THEN EXTRACT(MONTH FROM COALESCE(md.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) - md.start_month + 1
            WHEN gs.year = md.start_year THEN 12 - md.start_month + 1
            WHEN gs.year = EXTRACT(YEAR FROM COALESCE(md.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) THEN EXTRACT(MONTH FROM COALESCE(md.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day'))
            ELSE 12
        END as months_in_year
    FROM
        MemberData md,
        generate_series((SELECT min_year FROM MinYear), (SELECT max_year FROM MaxYear)) as gs(year)
    WHERE
        gs.year >= md.start_year AND 
        (md.ending_month IS NULL OR gs.year <= EXTRACT(YEAR FROM md.ending_month))
),
AdjustedAmounts AS (
    SELECT
        ms.team_id,
        ms.member_id,
        ms.member_name,
        ms.team_name,
        ms.year,
        ms.created_at,
        ms.amount * ms.months_in_year * POWER(1 + COALESCE(ms.raise_percentage, 0) / 100, ms.year - ms.start_year) AS year_amount
    FROM
        MonthlySums ms
)
SELECT
    md.team_name,
    md.member_name AS item_name,
    ARRAY(
        SELECT COALESCE(aa.year_amount, NULL)
        FROM generate_series((SELECT min_year FROM MinYear), (SELECT max_year FROM MaxYear)) AS gs(year)
        LEFT JOIN AdjustedAmounts aa ON aa.year = gs.year AND aa.member_id = md.member_id
        ORDER BY gs.year
    ) AS yearly_values,
    md.created_at
FROM
    MemberData md
GROUP BY
    md.team_id, md.member_id, md.team_name, md.member_name, md.created_at
ORDER BY
    md.team_name, md.member_name, md.created_at;
`;

export const YEARLY_AGGREGATE_TEAM_EXPENSES = (organization_id: string) => sql`
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
YearSeries AS (
    SELECT
        generate_series((SELECT min_year FROM MinYear), (SELECT max_year FROM MaxYear)) AS year
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
        ys.year,
        CASE
            WHEN ys.year = ed.start_year AND ys.year = EXTRACT(YEAR FROM COALESCE(ed.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) THEN EXTRACT(MONTH FROM COALESCE(ed.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) - ed.start_month + 1
            WHEN ys.year = ed.start_year THEN 12 - ed.start_month + 1
            WHEN ys.year = EXTRACT(YEAR FROM COALESCE(ed.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) THEN EXTRACT(MONTH FROM COALESCE(ed.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day'))
            ELSE 12
        END as months_in_year
    FROM
        ExpenseData ed
    CROSS JOIN
        YearSeries ys
    WHERE
        ys.year >= ed.start_year AND 
        (ed.ending_month IS NULL OR ys.year <= EXTRACT(YEAR FROM ed.ending_month))
),
AdjustedAmounts AS (
    SELECT
        ms.team_id,
        ms.expense_id,
        ms.expense_name AS item_name,
        ms.team_name,
        ms.year,
        ms.created_at,
        ms.amount * ms.months_in_year * POWER(1 + COALESCE(ms.raise_percentage, 0) / 100, ms.year - ms.start_year) AS year_amount
    FROM
        MonthlySums ms
),
MemberData AS (
    SELECT
        t.team_id,
        m.member_id,
        m.name AS member_name,
        t.name AS team_name,
        m.created_at,
        EXTRACT(YEAR FROM m.starting_month) AS start_year,
        EXTRACT(MONTH FROM m.starting_month) AS start_month,
        m.ending_month,
        m.salary AS amount,
        m.raise_percentage
    FROM
        team t
        INNER JOIN member m ON t.team_id = m.team_id
    WHERE
        t.organization_id = ${organization_id} AND
        m.name IS NOT NULL AND
        m.name <> ''
),
MonthlySumsMember AS (
    SELECT
        md.team_id,
        md.member_id,
        md.member_name,
        md.team_name,
        md.created_at,
        md.start_year,
        md.start_month,
        md.ending_month,
        md.amount,
        md.raise_percentage,
        ys.year,
        CASE
            WHEN ys.year = md.start_year AND ys.year = EXTRACT(YEAR FROM COALESCE(md.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) THEN EXTRACT(MONTH FROM COALESCE(md.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) - md.start_month + 1
            WHEN ys.year = md.start_year THEN 12 - md.start_month + 1
            WHEN ys.year = EXTRACT(YEAR FROM COALESCE(md.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) THEN EXTRACT(MONTH FROM COALESCE(md.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day'))
            ELSE 12
        END as months_in_year
    FROM
        MemberData md
    CROSS JOIN
        YearSeries ys
    WHERE
        ys.year >= md.start_year AND 
        (md.ending_month IS NULL OR ys.year <= EXTRACT(YEAR FROM md.ending_month))
),
AdjustedAmountsMember AS (
    SELECT
        msm.team_id,
        msm.member_id,
        msm.member_name AS item_name,
        msm.team_name,
        msm.year,
        msm.created_at,
        msm.amount * msm.months_in_year * POWER(1 + COALESCE(msm.raise_percentage, 0) / 100, msm.year - msm.start_year) AS year_amount
    FROM
        MonthlySumsMember msm
),
CombinedData AS (
    SELECT
        team_name,
        item_name,
        year,
        year_amount
    FROM
        AdjustedAmounts
    UNION ALL
    SELECT
        aam.team_name,
        aam.item_name,
        aam.year,
        aam.year_amount
    FROM
        AdjustedAmountsMember aam
),
AllItemsPerYear AS (
    SELECT DISTINCT
        cd.team_name,
        cd.item_name,
        ys.year
    FROM
        CombinedData cd
    CROSS JOIN
        YearSeries ys
    WHERE
        cd.team_name IS NOT NULL
),
FilledData AS (
    SELECT
        aipy.team_name,
        aipy.item_name,
        aipy.year,
        COALESCE(cd.year_amount, 0) AS year_amount
    FROM
        AllItemsPerYear aipy
    LEFT JOIN
        CombinedData cd
    ON
        aipy.team_name = cd.team_name AND aipy.item_name = cd.item_name AND aipy.year = cd.year
),
YearlyAggregatedData AS (
    SELECT
        team_name,
        year,
        jsonb_object_agg(item_name, year_amount) AS items
    FROM
        FilledData
    GROUP BY
        team_name, year
)
SELECT
    team_name,
    jsonb_agg(
        jsonb_strip_nulls(
            jsonb_build_object(
                'year', year
            ) || items
        )
        ORDER BY year
    ) AS values
FROM
    YearlyAggregatedData
GROUP BY
    team_name
ORDER BY
    team_name;
`;

export const YEARLY_AGGREGATE_EXPENSES = (organization_id: string) => sql`
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
YearSeries AS (
    SELECT
        generate_series((SELECT min_year FROM MinYear), (SELECT max_year FROM MaxYear)) AS year
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
        ys.year,
        CASE
            WHEN ys.year = ed.start_year AND ys.year = EXTRACT(YEAR FROM COALESCE(ed.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) THEN EXTRACT(MONTH FROM COALESCE(ed.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) - ed.start_month + 1
            WHEN ys.year = ed.start_year THEN 12 - ed.start_month + 1
            WHEN ys.year = EXTRACT(YEAR FROM COALESCE(ed.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) THEN EXTRACT(MONTH FROM COALESCE(ed.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day'))
            ELSE 12
        END as months_in_year
    FROM
        ExpenseData ed
    CROSS JOIN
        YearSeries ys
    WHERE
        ys.year >= ed.start_year AND 
        (ed.ending_month IS NULL OR ys.year <= EXTRACT(YEAR FROM ed.ending_month))
),
AdjustedAmounts AS (
    SELECT
        ms.team_id,
        ms.expense_id,
        ms.expense_name AS item_name,
        ms.team_name,
        ms.year,
        ms.created_at,
        ms.amount * ms.months_in_year * POWER(1 + COALESCE(ms.raise_percentage, 0) / 100, ms.year - ms.start_year) AS year_amount
    FROM
        MonthlySums ms
),
MemberData AS (
    SELECT
        t.team_id,
        m.member_id,
        m.name AS member_name,
        t.name AS team_name,
        m.created_at,
        EXTRACT(YEAR FROM m.starting_month) AS start_year,
        EXTRACT(MONTH FROM m.starting_month) AS start_month,
        m.ending_month,
        m.salary AS amount,
        m.raise_percentage
    FROM
        team t
        INNER JOIN member m ON t.team_id = m.team_id
    WHERE
        t.organization_id = ${organization_id} AND
        m.name IS NOT NULL AND
        m.name <> ''
),
MonthlySumsMember AS (
    SELECT
        md.team_id,
        md.member_id,
        md.member_name,
        md.team_name,
        md.created_at,
        md.start_year,
        md.start_month,
        md.ending_month,
        md.amount,
        md.raise_percentage,
        ys.year,
        CASE
            WHEN ys.year = md.start_year AND ys.year = EXTRACT(YEAR FROM COALESCE(md.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) THEN EXTRACT(MONTH FROM COALESCE(md.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) - md.start_month + 1
            WHEN ys.year = md.start_year THEN 12 - md.start_month + 1
            WHEN ys.year = EXTRACT(YEAR FROM COALESCE(md.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')) THEN EXTRACT(MONTH FROM COALESCE(md.ending_month, DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day'))
            ELSE 12
        END as months_in_year
    FROM
        MemberData md
    CROSS JOIN
        YearSeries ys
    WHERE
        ys.year >= md.start_year AND 
        (md.ending_month IS NULL OR ys.year <= EXTRACT(YEAR FROM md.ending_month))
),
AdjustedAmountsMember AS (
    SELECT
        msm.team_id,
        msm.member_id,
        msm.member_name AS item_name,
        msm.team_name,
        msm.year,
        msm.created_at,
        msm.amount * msm.months_in_year * POWER(1 + COALESCE(msm.raise_percentage, 0) / 100, msm.year - msm.start_year) AS year_amount
    FROM
        MonthlySumsMember msm
),
CombinedData AS (
    SELECT
        team_name,
        item_name,
        year,
        year_amount
    FROM
        AdjustedAmounts
    UNION ALL
    SELECT
        aam.team_name,
        aam.item_name,
        aam.year,
        aam.year_amount
    FROM
        AdjustedAmountsMember aam
),
AllItemsPerYear AS (
    SELECT DISTINCT
        cd.team_name,
        cd.item_name,
        ys.year
    FROM
        CombinedData cd
    CROSS JOIN
        YearSeries ys
    WHERE
        cd.team_name IS NOT NULL
),
FilledData AS (
    SELECT
        aipy.team_name,
        aipy.item_name,
        aipy.year,
        COALESCE(cd.year_amount, 0) AS year_amount
    FROM
        AllItemsPerYear aipy
    LEFT JOIN
        CombinedData cd
    ON
        aipy.team_name = cd.team_name AND aipy.item_name = cd.item_name AND aipy.year = cd.year
),
YearlyAggregatedData AS (
    SELECT
        year,
        jsonb_object_agg(item_name, year_amount) AS items
    FROM
        FilledData
    GROUP BY
        year
)
SELECT
    jsonb_agg(
        jsonb_strip_nulls(
            jsonb_build_object(
                'year', year
            ) || items
        )
        ORDER BY year
    ) AS values
FROM
    YearlyAggregatedData
`;
