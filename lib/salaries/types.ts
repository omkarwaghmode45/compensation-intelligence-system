import type { Level } from "@prisma/client";

export type SalaryListItem = {
  id: string;
  company: string;
  normalizedCompany: string;
  role: string;
  level: Level;
  location: string;
  experienceYears: number;
  baseSalary: number;
  bonus: number;
  stock: number;
  totalCompensation: number;
  confidenceScore: number;
  createdAt: Date;
};

export type ComparableSalary = Omit<SalaryListItem, "createdAt" | "normalizedCompany">;

export type CompanyInsight = {
  company: string;
  normalizedCompany: string;
  submissions: number;
  averageTotalCompensation: number;
};

export type LevelDistribution = {
  level: Level;
  count: number;
};

export type CompensationBreakdownSummary = {
  averageBaseSalary: number;
  averageBonus: number;
  averageStock: number;
  averageTotalCompensation: number;
};
