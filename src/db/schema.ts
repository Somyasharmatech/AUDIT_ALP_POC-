import { pgTable, uuid, varchar, timestamp, boolean, text, date, integer } from 'drizzle-orm/pg-core';

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
  knowledgeSources: text('knowledge_sources'),
  questionnaire: text('questionnaire'),
  workspaceData: text('workspace_data'),
  isArchived: boolean('is_archived').default(false).notNull(),
  readinessScore: integer('readiness_score').default(0),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const auditUniverse = pgTable('audit_universe', {
  id: uuid('id').primaryKey().defaultRandom(),
  department: varchar('department', { length: 255 }).notNull(),
  auditEntity: varchar('audit_entity', { length: 255 }).notNull(),
  businessUnit: varchar('business_unit', { length: 255 }),
  auditType: varchar('audit_type', { length: 100 }),
  businessCriticality: varchar('business_criticality', { length: 50 }).default('Medium'), // High, Medium, Low
  auditFrequency: varchar('audit_frequency', { length: 50 }).default('Annual'), // Annual, Biennial, Triennial, Ad-hoc
  status: varchar('status', { length: 50 }).default('Active'),
  isArchived: boolean('is_archived').default(false).notNull(),
  description: text('description'),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  engagementId: uuid('engagement_id').references(() => engagements.id, { onDelete: 'cascade' }),
  universeId: uuid('universe_id').references(() => auditUniverse.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull().default('SOP'), // SOP, Charter, Prior Audit Report, Process Flow, Trial Balance, Policy, Other
  fileSize: integer('file_size').notNull().default(0),
  fileType: varchar('file_type', { length: 100 }),
  filePath: varchar('file_path', { length: 500 }).notNull(),
  fileHash: varchar('file_hash', { length: 128 }),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  version: integer('version').notNull().default(1),
  isLatest: boolean('is_latest').notNull().default(true),
  status: varchar('status', { length: 50 }).notNull().default('Active'), // Active, Archived, Deleted
  aiStatus: varchar('ai_status', { length: 50 }).notNull().default('Uploaded'), // Uploaded, Processed, Reviewed, Approved, Used in AI
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const documentVersions = pgTable('document_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').references(() => documents.id, { onDelete: 'cascade' }).notNull(),
  version: integer('version').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  filePath: varchar('file_path', { length: 500 }).notNull(),
  fileSize: integer('file_size').notNull().default(0),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  changeSummary: text('change_summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const historicalAudits = pgTable('historical_audits', {
  id: uuid('id').primaryKey().defaultRandom(),
  universeId: uuid('universe_id').references(() => auditUniverse.id, { onDelete: 'cascade' }),
  engagementId: uuid('engagement_id').references(() => engagements.id, { onDelete: 'cascade' }),
  auditYear: varchar('audit_year', { length: 50 }).notNull(),
  auditTitle: varchar('audit_title', { length: 255 }).notNull(),
  overallOpinion: varchar('overall_opinion', { length: 100 }).default('Qualified'), // Unqualified, Qualified, Adverse, Disclaimer
  overallRiskRating: varchar('overall_risk_rating', { length: 50 }).default('Medium'), // Critical, High, Medium, Low
  auditorInCharge: varchar('auditor_in_charge', { length: 255 }),
  completedDate: date('completed_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const historicalFindings = pgTable('historical_findings', {
  id: uuid('id').primaryKey().defaultRandom(),
  historicalAuditId: uuid('historical_audit_id').references(() => historicalAudits.id, { onDelete: 'cascade' }),
  engagementId: uuid('engagement_id').references(() => engagements.id, { onDelete: 'cascade' }),
  findingCode: varchar('finding_code', { length: 50 }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  severity: varchar('severity', { length: 50 }).default('Medium').notNull(), // Critical, High, Medium, Low
  isRepeat: boolean('is_repeat').default(false).notNull(),
  repeatCount: integer('repeat_count').default(0).notNull(),
  managementResponse: text('management_response'),
  issueStatus: varchar('issue_status', { length: 50 }).default('Open').notNull(), // Open, In Progress, Closed, Overdue
  targetClosureDate: date('target_closure_date'),
  closedDate: date('closed_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const planningQuestionnaires = pgTable('planning_questionnaires', {
  id: uuid('id').primaryKey().defaultRandom(),
  engagementId: uuid('engagement_id').references(() => engagements.id, { onDelete: 'cascade' }).notNull(),
  version: integer('version').default(1).notNull(),
  responses: text('responses').notNull(), // JSON string array of Q&A objects
  savedBy: uuid('saved_by').references(() => users.id),
  status: varchar('status', { length: 50 }).default('Draft').notNull(), // Draft, Submitted, Finalized
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const approvalHistory = pgTable('approval_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  engagementId: uuid('engagement_id').references(() => engagements.id, { onDelete: 'cascade' }).notNull(),
  step: varchar('step', { length: 100 }).notNull(), // Draft Submission, Manager Review, Head Sign-Off
  status: varchar('status', { length: 50 }).notNull(), // Pending, Approved, Changes Requested, Rejected
  reviewerId: uuid('reviewer_id').references(() => users.id),
  reviewerName: varchar('reviewer_name', { length: 255 }),
  comments: text('comments'),
  decidedAt: timestamp('decided_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const systemAuditLogs = pgTable('system_audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  userName: varchar('user_name', { length: 255 }),
  action: varchar('action', { length: 100 }).notNull(), // CREATE, UPDATE, DELETE, ARCHIVE, RESTORE, UPLOAD_DOCUMENT, APPROVAL
  entityType: varchar('entity_type', { length: 100 }).notNull(), // Engagement, AuditUniverse, Document, Questionnaire, Approval
  entityId: varchar('entity_id', { length: 255 }),
  details: text('details'),
  ipAddress: varchar('ip_address', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

