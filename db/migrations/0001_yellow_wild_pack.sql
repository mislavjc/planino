CREATE TABLE IF NOT EXISTS "loan" (
	"loanId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"organizationId" uuid NOT NULL,
	"name" text,
	"interestRate" numeric,
	"duration" integer,
	"startingMonth" timestamp,
	"amount" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization" (
	"organizationId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "loansOrganizationIdIndex" ON "loan" ("organizationId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "organizationsNameKey" ON "organization" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loan" ADD CONSTRAINT "loan_organizationId_organization_organizationId_fk" FOREIGN KEY ("organizationId") REFERENCES "organization"("organizationId") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization" ADD CONSTRAINT "organization_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
