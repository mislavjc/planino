import { sql } from 'drizzle-orm';
import {
  bigint,
  date,
  foreignKey,
  numeric,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

export const inventoryItems = pgTable('inventory_items', {
  inventoryItemId: uuid('inventory_item_id')
    .defaultRandom()
    .primaryKey()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  name: text('name'),
  startingMonth: date('starting_month'),
  value: numeric('value'),
  amortizationLength: smallint('amortization_length'),
  inventoryGroupId: uuid('inventory_group_id')
    .notNull()
    .references(() => inventoryGroups.inventoryGroupId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});

export const expenseFrequencies = pgTable('expense_frequencies', {
  expenseFrequencyId: uuid('expense_frequency_id')
    .defaultRandom()
    .primaryKey()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  frequency: smallint('frequency').notNull(),
});

export const monthlyFinancials = pgTable('monthly_financials', {
  monthlyFinancialId: uuid('monthly_financial_id')
    .defaultRandom()
    .primaryKey()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.productId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  monthYear: date('month_year').notNull(),
  pricePerUnit: numeric('price_per_unit').notNull(),
  costBasis: numeric('cost_basis').notNull(),
});

export const financialAttributes = pgTable('financial_attributes', {
  financialAttributeId: uuid('financial_attribute_id')
    .defaultRandom()
    .primaryKey()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  startingMonth: date('starting_month'),
  amount: numeric('amount'),
  raisePercent: numeric('raise_percent'),
  endingMonth: date('ending_month'),
  userId: uuid('user_id').default(sql`auth.uid()`),
});

export const inventoryGroups = pgTable('inventory_groups', {
  inventoryGroupId: uuid('inventory_group_id')
    .defaultRandom()
    .primaryKey()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  name: text('name').notNull(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.organizationId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});

export const members = pgTable('members', {
  memberId: uuid('member_id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  teamId: uuid('team_id')
    .notNull()
    .references(() => teams.teamId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  roleName: text('role_name').notNull(),
  paycheckId: uuid('paycheck_id')
    .notNull()
    .references(() => paychecks.paycheckId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});

export const organizations = pgTable(
  'organizations',
  {
    organizationId: uuid('organization_id')
      .defaultRandom()
      .primaryKey()
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    name: text('name').notNull(),
    userId: uuid('user_id')
      .default(sql`auth.uid()`)
      .notNull(),
  },
  (table) => {
    return {
      organizationsNameKey: unique('organizations_name_key').on(table.name),
    };
  },
);

export const productGroups = pgTable('product_groups', {
  productGroupId: uuid('product_group_id')
    .defaultRandom()
    .primaryKey()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  name: text('name').notNull(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.organizationId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});

export const products = pgTable('products', {
  productId: uuid('product_id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  name: text('name').notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  itemCount: bigint('item_count', { mode: 'number' }).notNull(),
  productGroupId: uuid('product_group_id')
    .notNull()
    .references(() => productGroups.productGroupId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});

export const teams = pgTable('teams', {
  teamId: uuid('team_id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  name: text('name').notNull(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.organizationId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});

export const expenseTypes = pgTable('expense_types', {
  expenseTypeId: uuid('expense_type_id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  type: text('type').notNull(),
});

export const expenses = pgTable(
  'expenses',
  {
    expenseId: uuid('expense_id').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    name: text('name'),
    financialAttributeId: uuid('financial_attribute_id').references(
      () => financialAttributes.financialAttributeId,
      { onDelete: 'cascade', onUpdate: 'cascade' },
    ),
    expenseFrequencyId: uuid('expense_frequency_id').references(
      () => expenseFrequencies.expenseFrequencyId,
      { onDelete: 'cascade', onUpdate: 'cascade' },
    ),
    expenseTypeId: uuid('expense_type_id').references(
      () => expenseTypes.expenseTypeId,
      { onDelete: 'cascade', onUpdate: 'cascade' },
    ),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.teamId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
  },
  (table) => {
    return {
      expensesFinancialAttributeIdKey: unique(
        'expenses_financial_attribute_id_key',
      ).on(table.financialAttributeId),
    };
  },
);

export const loans = pgTable('loans', {
  loanId: uuid('loan_id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  name: text('name'),
  interestRate: numeric('interest_rate'),
  duration: smallint('duration'),
  startingMonth: date('starting_month'),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.organizationId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  amount: numeric('amount'),
});

export const paychecks = pgTable('paychecks', {
  paycheckId: uuid('paycheck_id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  financialAttributeId: uuid('financial_attribute_id')
    .notNull()
    .references(() => financialAttributes.financialAttributeId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  expenseTypeId: uuid('expense_type_id')
    .notNull()
    .references(() => expenseTypes.expenseTypeId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});
