CREATE TABLE IF NOT EXISTS "inventoryItem" (
	"inventoryItemId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"name" text,
	"value" numeric,
	"startingMonth" timestamp,
	"amortizationLength" integer,
	"teamId" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventoryItem" ADD CONSTRAINT "inventoryItem_teamId_team_teamId_fk" FOREIGN KEY ("teamId") REFERENCES "team"("teamId") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
