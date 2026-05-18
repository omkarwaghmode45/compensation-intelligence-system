export type Level = "L3" | "L4" | "L5" | "L6" | "L7";

export type SalaryListItem = {
  id: string;
  company: string;
  normalizedCompany: string;
  role: string;
  level: Level;
  location: string | null;
  experienceYears: number | null;
  baseSalary: number;
  bonus: number;
  stock: number;
  totalCompensation: number;
  confidenceScore: number;
  createdAt: Date | string;
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
