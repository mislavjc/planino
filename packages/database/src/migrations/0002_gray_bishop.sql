DO $$ BEGIN
 CREATE TYPE "block_type" AS ENUM('text', 'component');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "block" DROP COLUMN IF EXISTS "type";