DROP INDEX IF EXISTS "organizations_name_key";--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "expense" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "financial_attribute" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "inventory_item" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "loan" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "product_price_history" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "product_price_history" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "organizations_slug_key" ON "organization" ("slug");