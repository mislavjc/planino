CREATE TABLE IF NOT EXISTS "block" (
	"block_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"business_plan_id" uuid NOT NULL,
	"type" text,
	"order" integer,
	"content" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business_plan" (
	"business_plan_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"organization_id" uuid NOT NULL,
	"name" text,
	"description" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "block" ADD CONSTRAINT "block_business_plan_id_business_plan_business_plan_id_fk" FOREIGN KEY ("business_plan_id") REFERENCES "business_plan"("business_plan_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business_plan" ADD CONSTRAINT "business_plan_organization_id_organization_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organization"("organization_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
