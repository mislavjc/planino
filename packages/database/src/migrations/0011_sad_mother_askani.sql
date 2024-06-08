ALTER TABLE "imported_table" ALTER COLUMN "headers" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "imported_table" ALTER COLUMN "mapped_headers" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "imported_table" ADD COLUMN "coordinates" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "imported_table" ADD COLUMN "args" jsonb;