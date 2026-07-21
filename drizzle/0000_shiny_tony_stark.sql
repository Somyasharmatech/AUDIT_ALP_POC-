CREATE TABLE "audit_universe" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"department" varchar(255) NOT NULL,
	"audit_entity" varchar(255) NOT NULL,
	"business_criticality" varchar(50) DEFAULT 'Medium',
	"audit_frequency" varchar(50) DEFAULT 'Annual',
	"status" varchar(50) DEFAULT 'Active',
	"owner_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "engagements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"department" varchar(255) NOT NULL,
	"business_unit" varchar(255),
	"financial_year" varchar(50) NOT NULL,
	"audit_type" varchar(100),
	"priority" varchar(50) DEFAULT 'Medium',
	"status" varchar(50) DEFAULT 'Planning' NOT NULL,
	"planning_lead_id" uuid,
	"audit_manager_id" uuid,
	"start_date" date,
	"expected_end_date" date,
	"description" text,
	"owner_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'Auditor' NOT NULL,
	"name" varchar(255),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "audit_universe" ADD CONSTRAINT "audit_universe_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engagements" ADD CONSTRAINT "engagements_planning_lead_id_users_id_fk" FOREIGN KEY ("planning_lead_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engagements" ADD CONSTRAINT "engagements_audit_manager_id_users_id_fk" FOREIGN KEY ("audit_manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engagements" ADD CONSTRAINT "engagements_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;