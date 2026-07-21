import { pgTable, uuid, varchar, timestamp, boolean, text, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('Auditor'), // Administrator, Head of Internal Audit, Audit Manager, Senior Auditor, Auditor, Reviewer
  name: varchar('name', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const engagements = pgTable('engagements', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  department: varchar('department', { length: 255 }).notNull(),
  businessUnit: varchar('business_unit', { length: 255 }),
  financialYear: varchar('financial_year', { length: 50 }).notNull(),
  auditType: varchar('audit_type', { length: 100 }),
  priority: varchar('priority', { length: 50 }).default('Medium'),
  status: varchar('status', { length: 50 }).notNull().default('Planning'),
  planningLeadId: uuid('planning_lead_id').references(() => users.id),
  auditManagerId: uuid('audit_manager_id').references(() => users.id),
  startDate: date('start_date'),
  expectedEndDate: date('expected_end_date'),
  description: text('description'),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const auditUniverse = pgTable('audit_universe', {
  id: uuid('id').primaryKey().defaultRandom(),
  department: varchar('department', { length: 255 }).notNull(),
  auditEntity: varchar('audit_entity', { length: 255 }).notNull(),
  businessCriticality: varchar('business_criticality', { length: 50 }).default('Medium'), // High, Medium, Low
  auditFrequency: varchar('audit_frequency', { length: 50 }).default('Annual'), // Annual, Biennial, Triennial, Ad-hoc
  status: varchar('status', { length: 50 }).default('Active'),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
