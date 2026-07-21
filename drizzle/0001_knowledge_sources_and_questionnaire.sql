ALTER TABLE "engagements" ADD COLUMN IF NOT EXISTS "knowledge_sources" text;
--> statement-breakpoint
ALTER TABLE "engagements" ADD COLUMN IF NOT EXISTS "questionnaire" text;
--> statement-breakpoint
ALTER TABLE "engagements" ADD COLUMN IF NOT EXISTS "workspace_data" text;
--> statement-breakpoint
ALTER TABLE "engagements" ADD COLUMN IF NOT EXISTS "is_archived" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "engagements" ADD COLUMN IF NOT EXISTS "readiness_score" integer DEFAULT 0;
--> statement-breakpoint
ALTER TABLE "engagements" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();
--> statement-breakpoint
ALTER TABLE "audit_universe" ADD COLUMN IF NOT EXISTS "business_unit" varchar(255);
--> statement-breakpoint
ALTER TABLE "audit_universe" ADD COLUMN IF NOT EXISTS "audit_type" varchar(100);
--> statement-breakpoint
ALTER TABLE "audit_universe" ADD COLUMN IF NOT EXISTS "is_archived" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "audit_universe" ADD COLUMN IF NOT EXISTS "description" text;
--> statement-breakpoint
ALTER TABLE "audit_universe" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "engagement_id" uuid REFERENCES "engagements"("id") ON DELETE CASCADE,
    "universe_id" uuid REFERENCES "audit_universe"("id") ON DELETE CASCADE,
    "name" varchar(255) NOT NULL,
    "category" varchar(100) DEFAULT 'SOP' NOT NULL,
    "file_size" integer DEFAULT 0 NOT NULL,
    "file_type" varchar(100),
    "file_path" varchar(500) NOT NULL,
    "file_hash" varchar(128),
    "uploaded_by" uuid REFERENCES "users"("id"),
    "version" integer DEFAULT 1 NOT NULL,
    "is_latest" boolean DEFAULT true NOT NULL,
    "status" varchar(50) DEFAULT 'Active' NOT NULL,
    "ai_status" varchar(50) DEFAULT 'Uploaded' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document_versions" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "document_id" uuid REFERENCES "documents"("id") ON DELETE CASCADE NOT NULL,
    "version" integer NOT NULL,
    "name" varchar(255) NOT NULL,
    "file_path" varchar(500) NOT NULL,
    "file_size" integer DEFAULT 0 NOT NULL,
    "uploaded_by" uuid REFERENCES "users"("id"),
    "change_summary" text,
    "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "historical_audits" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "universe_id" uuid REFERENCES "audit_universe"("id") ON DELETE CASCADE,
    "engagement_id" uuid REFERENCES "engagements"("id") ON DELETE CASCADE,
    "audit_year" varchar(50) NOT NULL,
    "audit_title" varchar(255) NOT NULL,
    "overall_opinion" varchar(100) DEFAULT 'Qualified',
    "overall_risk_rating" varchar(50) DEFAULT 'Medium',
    "auditor_in_charge" varchar(255),
    "completed_date" date,
    "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "historical_findings" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "historical_audit_id" uuid REFERENCES "historical_audits"("id") ON DELETE CASCADE,
    "engagement_id" uuid REFERENCES "engagements"("id") ON DELETE CASCADE,
    "finding_code" varchar(50),
    "title" varchar(255) NOT NULL,
    "description" text NOT NULL,
    "severity" varchar(50) DEFAULT 'Medium' NOT NULL,
    "is_repeat" boolean DEFAULT false NOT NULL,
    "repeat_count" integer DEFAULT 0 NOT NULL,
    "management_response" text,
    "issue_status" varchar(50) DEFAULT 'Open' NOT NULL,
    "target_closure_date" date,
    "closed_date" date,
    "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "planning_questionnaires" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "engagement_id" uuid REFERENCES "engagements"("id") ON DELETE CASCADE NOT NULL,
    "version" integer DEFAULT 1 NOT NULL,
    "responses" text NOT NULL,
    "saved_by" uuid REFERENCES "users"("id"),
    "status" varchar(50) DEFAULT 'Draft' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "approval_history" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "engagement_id" uuid REFERENCES "engagements"("id") ON DELETE CASCADE NOT NULL,
    "step" varchar(100) NOT NULL,
    "status" varchar(50) NOT NULL,
    "reviewer_id" uuid REFERENCES "users"("id"),
    "reviewer_name" varchar(255),
    "comments" text,
    "decided_at" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system_audit_logs" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid REFERENCES "users"("id"),
    "user_name" varchar(255),
    "action" varchar(100) NOT NULL,
    "entity_type" varchar(100) NOT NULL,
    "entity_id" varchar(255),
    "details" text,
    "ip_address" varchar(100),
    "created_at" timestamp DEFAULT now() NOT NULL
);
