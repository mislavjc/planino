CREATE TABLE IF NOT EXISTS "imported_file" (
	"imported_file_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "imported_table" (
	"imported_table_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"imported_file_id" uuid NOT NULL,
	"type" text NOT NULL,
	"headers" jsonb NOT NULL,
	"mapped_headers" jsonb NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "imported_file" ADD CONSTRAINT "imported_file_organization_id_organization_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("organization_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "imported_table" ADD CONSTRAINT "imported_table_imported_file_id_imported_file_imported_file_id_fk" FOREIGN KEY ("imported_file_id") REFERENCES "public"."imported_file"("imported_file_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "imported_file_name_index" ON "imported_file" ("name");