-- Create the production Salary table with snake_case compensation fields.
CREATE TABLE "Salary" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "location" TEXT,
    "experience_years" INTEGER,
    "base_salary" INTEGER NOT NULL,
    "bonus" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "total_compensation" INTEGER NOT NULL,
    "confidence_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- Preserve any existing data from the previous app model during migration.
INSERT INTO "Salary" (
    "id",
    "company",
    "role",
    "level",
    "location",
    "experience_years",
    "base_salary",
    "bonus",
    "stock",
    "total_compensation",
    "confidence_score",
    "created_at"
)
SELECT
    "id",
    "normalizedCompany",
    "role",
    "level"::TEXT,
    "location",
    ROUND("experienceYears")::INTEGER,
    "baseSalary",
    "bonus",
    "stock",
    "totalCompensation",
    "confidenceScore",
    "createdAt"
FROM "SalarySubmission";

DROP TABLE "SalarySubmission";
DROP TYPE "Level";

CREATE INDEX "Salary_company_idx" ON "Salary"("company");
CREATE INDEX "Salary_level_idx" ON "Salary"("level");
CREATE INDEX "Salary_role_idx" ON "Salary"("role");
CREATE INDEX "Salary_location_idx" ON "Salary"("location");
CREATE INDEX "Salary_total_compensation_idx" ON "Salary"("total_compensation");
