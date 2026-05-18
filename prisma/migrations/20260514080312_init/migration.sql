-- CreateEnum
CREATE TYPE "Level" AS ENUM ('L3', 'L4', 'L5', 'L6', 'L7');

-- CreateTable
CREATE TABLE "SalarySubmission" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "normalizedCompany" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "location" TEXT NOT NULL,
    "experienceYears" DOUBLE PRECISION NOT NULL,
    "baseSalary" INTEGER NOT NULL,
    "bonus" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "totalCompensation" INTEGER NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalarySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SalarySubmission_normalizedCompany_idx" ON "SalarySubmission"("normalizedCompany");

-- CreateIndex
CREATE INDEX "SalarySubmission_level_idx" ON "SalarySubmission"("level");

-- CreateIndex
CREATE INDEX "SalarySubmission_role_idx" ON "SalarySubmission"("role");

-- CreateIndex
CREATE INDEX "SalarySubmission_location_idx" ON "SalarySubmission"("location");

-- CreateIndex
CREATE INDEX "SalarySubmission_totalCompensation_idx" ON "SalarySubmission"("totalCompensation");
