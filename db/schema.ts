import type { AdapterAccount } from '@auth/core/adapters';
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
import { createInsertSchema } from 'drizzle-zod';

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
    type: text('type').$type<AdapterAccount['type']>().notNull(),
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
    organizationId: uuid('organizationId')
      .notNull()
      .primaryKey()
      .defaultRandom(),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    name: text('name').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (organizations) => {
    return {
      organizationsNameKey: uniqueIndex('organizationsNameKey').on(
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
    loanId: uuid('loanId').notNull().primaryKey().defaultRandom(),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    organizationId: uuid('organizationId')
      .notNull()
      .references(() => organizations.organizationId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    name: text('name'),
    interestRate: numeric('interestRate'),
    duration: integer('duration'),
    startingMonth: timestamp('startingMonth', { mode: 'date' }),
    amount: numeric('amount'),
  },
  (loans) => {
    return {
      loansOrganizationIdIndex: index('loansOrganizationIdIndex').on(
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
