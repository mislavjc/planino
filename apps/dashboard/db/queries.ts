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

export const INVENTORY_VALUES = (organization_id: string) => sql`
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
        t.organization_id = ${organization_id}
    AND i.name <> ''
),
MinMaxYears AS (
    SELECT 
        MIN(EXTRACT(YEAR FROM i.starting_month)) AS min_year,
        MAX(EXTRACT(YEAR FROM i.starting_month) + i.amortization_length - 1) AS max_year
    FROM 
        inventory_item i
        JOIN team t ON i.team_id = t.team_id
    WHERE
        t.organization_id = ${organization_id}
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
        t.organization_id = ${organization_id}
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
    generate_series((SELECT min_year FROM MinMaxYears), (SELECT max_year FROM MinMaxYears)) AS y
GROUP BY
    t.team_name, t.item_name, t.min_year, t.max_year
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
MinYear AS (
    SELECT
        MIN(start_year) AS min_year
    FROM (
        SELECT start_year FROM ExpenseData
        UNION ALL
        SELECT start_year FROM MemberData
    ) AS combined_start_years
),
MaxYear AS (
    SELECT
        MAX(COALESCE(EXTRACT(YEAR FROM ending_month), EXTRACT(YEAR FROM CURRENT_DATE))) AS max_year
    FROM (
        SELECT ending_month FROM ExpenseData
        UNION ALL
        SELECT ending_month FROM MemberData
    ) AS combined_ending_months
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
        EXTRACT(YEAR FROM fa.ending_month) AS ending_year,
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
MemberData AS (
    SELECT
        t.team_id,
        m.member_id,
        m.name AS member_name,
        t.name AS team_name,
        m.created_at,
        EXTRACT(YEAR FROM m.starting_month) AS start_year,
        EXTRACT(MONTH FROM m.starting_month) AS start_month,
        EXTRACT(YEAR FROM m.ending_month) AS ending_year,
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
ProductData AS (
    SELECT
        pg.product_group_id,
        pg.name AS product_group_name,
        p.product_id,
        p.name AS product_name,
        EXTRACT(YEAR FROM pph.recorded_month) AS start_year,
        SUM(pph.unit_count * pph.unit_expense) AS amount
    FROM
        product_group pg
        INNER JOIN product p ON pg.product_group_id = p.product_group_id
        INNER JOIN product_price_history pph ON p.product_id = pph.product_id
    WHERE
        pg.organization_id = ${organization_id} AND
        p.name IS NOT NULL AND
        p.name <> ''
    GROUP BY
        pg.product_group_id, pg.name, p.product_id, p.name, EXTRACT(YEAR FROM pph.recorded_month)
),
MinYear AS (
    SELECT
        MIN(start_year) AS min_year
    FROM (
        SELECT start_year FROM ExpenseData
        UNION
        SELECT start_year FROM MemberData
        UNION
        SELECT start_year FROM ProductData
    ) AS combined_start_years
),
MaxYear AS (
    SELECT
        MAX(COALESCE(ending_year, EXTRACT(YEAR FROM CURRENT_DATE))) AS max_year
    FROM (
        SELECT ending_year FROM ExpenseData
        UNION
        SELECT ending_year FROM MemberData
        UNION
        SELECT start_year AS ending_year FROM ProductData
    ) AS combined_ending_years
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
        ed.ending_year,
        ed.amount,
        ed.raise_percentage,
        ys.year,
        CASE
            WHEN ys.year = ed.start_year AND ys.year = COALESCE(ed.ending_year, EXTRACT(YEAR FROM CURRENT_DATE)) THEN 12 - ed.start_month + 1
            WHEN ys.year = ed.start_year THEN 12 - ed.start_month + 1
            WHEN ys.year = COALESCE(ed.ending_year, EXTRACT(YEAR FROM CURRENT_DATE)) THEN 12
            ELSE 12
        END as months_in_year
    FROM
        ExpenseData ed
    CROSS JOIN
        YearSeries ys
    WHERE
        ys.year >= ed.start_year AND 
        (ed.ending_year IS NULL OR ys.year <= ed.ending_year)
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
MonthlySumsMember AS (
    SELECT
        md.team_id,
        md.member_id,
        md.member_name,
        md.team_name,
        md.created_at,
        md.start_year,
        md.start_month,
        md.ending_year,
        md.amount,
        md.raise_percentage,
        ys.year,
        CASE
            WHEN ys.year = md.start_year AND ys.year = COALESCE(md.ending_year, EXTRACT(YEAR FROM CURRENT_DATE)) THEN 12 - md.start_month + 1
            WHEN ys.year = md.start_year THEN 12 - md.start_month + 1
            WHEN ys.year = COALESCE(md.ending_year, EXTRACT(YEAR FROM CURRENT_DATE)) THEN 12
            ELSE 12
        END as months_in_year
    FROM
        MemberData md
    CROSS JOIN
        YearSeries ys
    WHERE
        ys.year >= md.start_year AND 
        (md.ending_year IS NULL OR ys.year <= md.ending_year)
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
MonthlySumsProduct AS (
    SELECT
        pd.product_group_id AS team_id,
        pd.product_id AS expense_id,
        pd.product_name AS item_name,
        pd.product_group_name AS team_name,
        pd.start_year,
        1 AS start_month,
        NULL AS ending_year,
        pd.amount,
        NULL AS raise_percentage,
        ys.year,
        12 as months_in_year
    FROM
        ProductData pd
    CROSS JOIN
        YearSeries ys
    WHERE
        ys.year = pd.start_year
),
AdjustedAmountsProduct AS (
    SELECT
        msp.team_id,
        msp.expense_id,
        msp.item_name,
        msp.team_name,
        msp.year,
        NULL AS created_at,
        msp.amount AS year_amount
    FROM
        MonthlySumsProduct msp
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
    UNION ALL
    SELECT
        aap.team_name,
        aap.item_name,
        aap.year,
        aap.year_amount
    FROM
        AdjustedAmountsProduct aap
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
    YearlyAggregatedData;
`;

export const MONTHLY_AGGREGATE_FIXED_COSTS_AND_SALES = (
  organization_id: string,
) => sql`
WITH ExpenseData AS (
    SELECT
        t.team_id,
        e.expense_id,
        e.name AS expense_name,
        t.name AS team_name,
        e.created_at,
        fa.starting_month,
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
MemberData AS (
    SELECT
        t.team_id,
        m.member_id,
        m.name AS member_name,
        t.name AS team_name,
        m.created_at,
        m.starting_month,
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
ProductSalesData AS (
    SELECT
        pph.product_id,
        p.product_group_id,
        pg.organization_id,
        pph.recorded_month,
        pph.unit_count,
        pph.unit_price,
        pph.unit_expense,
        pph.unit_count * pph.unit_price AS total_sales,
        pph.unit_count * pph.unit_expense AS total_variable_cost
    FROM
        product_price_history pph
        INNER JOIN product p ON p.product_id = pph.product_id
        INNER JOIN product_group pg ON pg.product_group_id = p.product_group_id
    WHERE
        pg.organization_id = ${organization_id}
),
MinMonth AS (
    SELECT
        MIN(starting_month) AS min_month
    FROM (
        SELECT starting_month FROM ExpenseData
        UNION
        SELECT starting_month FROM MemberData
        UNION
        SELECT recorded_month FROM ProductSalesData
    ) AS combined_start_months
),
MaxMonth AS (
    SELECT
        MAX(COALESCE(ending_month, CURRENT_DATE)) AS max_month
    FROM (
        SELECT ending_month FROM ExpenseData
        UNION
        SELECT ending_month FROM MemberData
        UNION
        SELECT recorded_month FROM ProductSalesData
    ) AS combined_ending_months
),
MonthSeries AS (
    SELECT
        generate_series((SELECT min_month FROM MinMonth), (SELECT max_month FROM MaxMonth), '1 month'::interval) AS month
),
MonthlySums AS (
    SELECT
        ed.team_id,
        ed.expense_id,
        ed.expense_name,
        ed.team_name,
        ed.created_at,
        ed.starting_month,
        ed.ending_month,
        ed.amount,
        ed.raise_percentage,
        ms.month,
        CASE
            WHEN ms.month >= ed.starting_month AND (ed.ending_month IS NULL OR ms.month <= ed.ending_month) THEN 1
            ELSE 0
        END as months_in_range
    FROM
        ExpenseData ed
    CROSS JOIN
        MonthSeries ms
),
AdjustedAmounts AS (
    SELECT
        ms.team_id,
        ms.expense_id,
        ms.expense_name AS item_name,
        ms.team_name,
        ms.month,
        ms.created_at,
        ms.amount * ms.months_in_range * POWER(1 + COALESCE(ms.raise_percentage, 0) / 100, EXTRACT(YEAR FROM ms.month) - EXTRACT(YEAR FROM ms.starting_month)) AS month_amount
    FROM
        MonthlySums ms
),
MonthlySumsMember AS (
    SELECT
        md.team_id,
        md.member_id,
        md.member_name,
        md.team_name,
        md.created_at,
        md.starting_month,
        md.ending_month,
        md.amount,
        md.raise_percentage,
        ms.month,
        CASE
            WHEN ms.month >= md.starting_month AND (md.ending_month IS NULL OR ms.month <= md.ending_month) THEN 1
            ELSE 0
        END as months_in_range
    FROM
        MemberData md
    CROSS JOIN
        MonthSeries ms
),
AdjustedAmountsMember AS (
    SELECT
        msm.team_id,
        msm.member_id,
        msm.member_name AS item_name,
        msm.team_name,
        msm.month,
        msm.created_at,
        msm.amount * msm.months_in_range * POWER(1 + COALESCE(msm.raise_percentage, 0) / 100, EXTRACT(YEAR FROM msm.month) - EXTRACT(YEAR FROM msm.starting_month)) AS month_amount
    FROM
        MonthlySumsMember msm
),
CombinedData AS (
    SELECT
        team_name,
        item_name,
        TO_CHAR(month, 'MM-YYYY') AS month,
        month_amount
    FROM
        AdjustedAmounts
    UNION ALL
    SELECT
        aam.team_name,
        aam.item_name,
        TO_CHAR(aam.month, 'MM-YYYY') AS month,
        aam.month_amount
    FROM
        AdjustedAmountsMember aam
),
MonthlyAggregatedData AS (
    SELECT
        month,
        SUM(month_amount) AS total_cost
    FROM
        CombinedData
    GROUP BY
        month
),
MonthlySales AS (
    SELECT
        TO_CHAR(recorded_month, 'MM-YYYY') AS month,
        SUM(total_sales) AS total_sales,
        SUM(total_variable_cost) AS total_variable_cost,
        SUM(unit_count) AS total_sold
    FROM
        ProductSalesData
    GROUP BY
        TO_CHAR(recorded_month, 'MM-YYYY')
)
SELECT
    jsonb_agg(
        jsonb_build_object(
            'month', COALESCE(mad.month, ms.month),
            'total_cost', COALESCE(mad.total_cost, 0),
            'total_sales', COALESCE(ms.total_sales, 0),
            'total_variable_cost', COALESCE(ms.total_variable_cost, 0),
            'total_sold', COALESCE(ms.total_sold, 0),
            'profit', COALESCE(ms.total_sales, 0) - COALESCE(mad.total_cost, 0)
        )
        ORDER BY to_date(COALESCE(mad.month, ms.month), 'MM-YYYY')
    ) AS values
FROM
    MonthlyAggregatedData mad
    FULL JOIN MonthlySales ms ON mad.month = ms.month;
`;

export const MONTHLY_AGGREGATE_EARNINGS = (organization_id: string) => sql`
WITH monthly_earnings AS (
    SELECT
        to_char(pph.recorded_month, 'MM-YYYY') AS month,
        p.name AS product_name,
        SUM(pph.unit_count * pph.unit_price) AS earnings
    FROM
        product_price_history pph
        JOIN product p ON pph.product_id = p.product_id
        JOIN product_group pg ON p.product_group_id = pg.product_group_id
    WHERE
        pg.organization_id = ${organization_id}
        AND p.name IS NOT NULL
        AND p.name <> ''
    GROUP BY
        to_char(pph.recorded_month, 'MM-YYYY'), p.name
),
all_months AS (
    SELECT DISTINCT to_char(pph.recorded_month, 'MM-YYYY') AS month
    FROM product_price_history pph
),
all_products AS (
    SELECT DISTINCT p.name AS product_name
    FROM product p
    WHERE p.name IS NOT NULL
    AND p.name <> ''
),
expanded_data AS (
    SELECT
        am.month,
        ap.product_name,
        COALESCE(me.earnings, 0) AS earnings
    FROM
        all_months am
        CROSS JOIN all_products ap
        LEFT JOIN monthly_earnings me
          ON am.month = me.month
          AND ap.product_name = me.product_name
),
FilledData AS (
    SELECT
        ed.month,
        jsonb_object_agg(ed.product_name, ed.earnings) AS earnings_by_product
    FROM
        expanded_data ed
    GROUP BY
        ed.month
)
SELECT
    jsonb_agg(
        jsonb_strip_nulls(
            jsonb_build_object(
                'month', fd.month
            ) || fd.earnings_by_product
        )
        ORDER BY fd.month
    ) AS values
FROM
    FilledData fd;
`;
