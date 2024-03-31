CREATE TABLE IF NOT EXISTS "expenseFrequency" (
	"expenseFrequencyId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expenseType" (
	"expenseTypeId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expense" (
	"expenseId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"name" text,
	"financialAttributeId" uuid NOT NULL,
	"expenseFrequencyId" uuid NOT NULL,
	"expenseTypeId" uuid NOT NULL,
	"teamId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "financialAttribute" (
	"financialAttributeId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"startingMonth" timestamp,
	"amount" numeric,
	"raisePercentage" numeric,
	"endingMonth" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team" (
	"teamId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"organizationId" uuid NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "expensesFinancialAttributeIdKey" ON "expense" ("financialAttributeId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expense" ADD CONSTRAINT "expense_financialAttributeId_financialAttribute_financialAttributeId_fk" FOREIGN KEY ("financialAttributeId") REFERENCES "financialAttribute"("financialAttributeId") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expense" ADD CONSTRAINT "expense_expenseFrequencyId_expenseFrequency_expenseFrequencyId_fk" FOREIGN KEY ("expenseFrequencyId") REFERENCES "expenseFrequency"("expenseFrequencyId") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expense" ADD CONSTRAINT "expense_expenseTypeId_expenseType_expenseTypeId_fk" FOREIGN KEY ("expenseTypeId") REFERENCES "expenseType"("expenseTypeId") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expense" ADD CONSTRAINT "expense_teamId_team_teamId_fk" FOREIGN KEY ("teamId") REFERENCES "team"("teamId") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team" ADD CONSTRAINT "team_organizationId_organization_organizationId_fk" FOREIGN KEY ("organizationId") REFERENCES "organization"("organizationId") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
