-- Allow minimum viable salary ingestion payloads while preserving existing data.
ALTER TABLE "SalarySubmission" ALTER COLUMN "location" DROP NOT NULL;
ALTER TABLE "SalarySubmission" ALTER COLUMN "experienceYears" DROP NOT NULL;
