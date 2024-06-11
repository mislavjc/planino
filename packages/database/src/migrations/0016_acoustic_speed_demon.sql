ALTER TABLE "organization" ADD COLUMN "personal_identification_number" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "industry" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "street_address" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "country" text;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "personal_identification_number_index" ON "organization" ("personal_identification_number");