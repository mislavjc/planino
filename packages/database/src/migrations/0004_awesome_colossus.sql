CREATE TABLE IF NOT EXISTS "product_group" (
	"product_group_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" text,
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_price_history" (
	"product_price_history_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"recorded_month" timestamp NOT NULL,
	"unit_count" numeric,
	"unit_expense" numeric,
	"unit_price" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"product_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" text,
	"product_group_id" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_group" ADD CONSTRAINT "product_group_organization_id_organization_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organization"("organization_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_price_history" ADD CONSTRAINT "product_price_history_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_product_group_id_product_group_product_group_id_fk" FOREIGN KEY ("product_group_id") REFERENCES "product_group"("product_group_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
