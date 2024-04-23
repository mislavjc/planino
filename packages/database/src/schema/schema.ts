import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  organizations: many(organizations),
}));

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const organizations = pgTable(
  'organization',
  {
    organizationId: uuid('organization_id')
      .notNull()
      .primaryKey()
      .defaultRandom(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    name: text('name').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (organizations) => {
    return {
      organizationsNameKey: uniqueIndex('organizations_name_key').on(
        organizations.name,
      ),
    };
  },
);

export const insertOrganzationSchema = createInsertSchema(organizations);

export const organizationsRelations = relations(
  organizations,
  ({ one, many }) => ({
    user: one(users, {
      fields: [organizations.userId],
      references: [users.id],
    }),
    loans: many(loans),
  }),
);

export const loans = pgTable(
  'loan',
  {
    loanId: uuid('loan_id').notNull().primaryKey().defaultRandom(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.organizationId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    name: text('name'),
    interestRate: numeric('interest_rate'),
    duration: integer('duration'),
    startingMonth: timestamp('starting_month', { mode: 'date' }),
    amount: numeric('amount'),
  },
  (loans) => {
    return {
      loansOrganizationIdIndex: index('loans_organization_id_index').on(
        loans.organizationId,
      ),
    };
  },
);

export const loansRelations = relations(loans, ({ one }) => ({
  organization: one(organizations, {
    fields: [loans.organizationId],
    references: [organizations.organizationId],
  }),
}));

export const insertLoanSchema = createInsertSchema(loans);

export const teams = pgTable('team', {
  teamId: uuid('team_id').notNull().primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  name: text('name').notNull(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.organizationId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});

export const teamsRelations = relations(teams, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [teams.organizationId],
    references: [organizations.organizationId],
  }),
  expenses: many(expenses),
  inventoryItems: many(inventoryItems),
}));

export const financialAttributes = pgTable('financial_attribute', {
  financialAttributeId: uuid('financial_attribute_id')
    .notNull()
    .primaryKey()
    .defaultRandom(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  startingMonth: timestamp('starting_month', { mode: 'date' }),
  amount: numeric('amount'),
  raisePercentage: numeric('raise_percentage'),
  endingMonth: timestamp('ending_month', { mode: 'date' }),
});

export const insertFinancialAttributeSchema =
  createInsertSchema(financialAttributes);
export const selectFinancialAttributeSchema =
  createSelectSchema(financialAttributes);

export const financialAttributesRelations = relations(
  financialAttributes,
  ({ one }) => ({
    expenses: one(expenses),
  }),
);

export const expenseFrequencies = pgTable('expense_frequency', {
  expenseFrequencyId: uuid('expense_frequency_id')
    .notNull()
    .primaryKey()
    .defaultRandom(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  name: text('name'),
});

export const insertExpenseFrequencySchema =
  createInsertSchema(expenseFrequencies);

export const expenseFrequenciesRelations = relations(
  expenseFrequencies,
  ({ one }) => ({
    expenses: one(expenses),
  }),
);

export const expenseTypes = pgTable('expense_type', {
  expenseTypeId: uuid('expense_type_id').notNull().primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  name: text('name'),
});

export const insertExpenseTypeSchema = createInsertSchema(expenseTypes);

export const expenseTypesRelations = relations(expenseTypes, ({ many }) => ({
  expenses: many(expenses),
}));

export const expenses = pgTable(
  'expense',
  {
    expenseId: uuid('expense_id').notNull().primaryKey().defaultRandom(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    name: text('name'),
    financialAttributeId: uuid('financial_attribute_id')
      .notNull()
      .references(() => financialAttributes.financialAttributeId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    expenseFrequencyId: uuid('expense_frequency_id')
      .notNull()
      .references(() => expenseFrequencies.expenseFrequencyId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    expenseTypeId: uuid('expense_type_id')
      .notNull()
      .references(() => expenseTypes.expenseTypeId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.teamId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
  },
  (expense) => {
    return {
      expensesFinancialAttributeIdKey: uniqueIndex(
        'expenses_financial_attribute_id_key',
      ).on(expense.financialAttributeId),
    };
  },
);

export const insertExpenseSchema = createInsertSchema(expenses);
export const selectExpenseSchema = createSelectSchema(expenses);

export const expensesRelations = relations(expenses, ({ one }) => ({
  financialAttribute: one(financialAttributes, {
    fields: [expenses.financialAttributeId],
    references: [financialAttributes.financialAttributeId],
  }),
  expenseFrequency: one(expenseFrequencies, {
    fields: [expenses.expenseFrequencyId],
    references: [expenseFrequencies.expenseFrequencyId],
  }),
  expenseType: one(expenseTypes, {
    fields: [expenses.expenseTypeId],
    references: [expenseTypes.expenseTypeId],
  }),
  team: one(teams, {
    fields: [expenses.teamId],
    references: [teams.teamId],
  }),
}));

export const inventoryItems = pgTable('inventory_item', {
  inventoryItemId: uuid('inventory_item_id')
    .notNull()
    .primaryKey()
    .defaultRandom(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  name: text('name'),
  value: numeric('value'),
  startingMonth: timestamp('starting_month', { mode: 'date' }),
  amortizationLength: integer('amortization_length'),
  teamId: uuid('team_id')
    .notNull()
    .references(() => teams.teamId, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});

export const selectInventoryItemSchema = createSelectSchema(inventoryItems);
export const insertInventoryItemSchema = createInsertSchema(inventoryItems);

export const inventoryItemsRelations = relations(inventoryItems, ({ one }) => ({
  team: one(teams, {
    fields: [inventoryItems.teamId],
    references: [teams.teamId],
  }),
}));
