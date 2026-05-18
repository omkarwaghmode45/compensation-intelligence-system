import type { Prisma, Salary } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatCompanyName } from "@/lib/formatters/company";
import {
  type ComparableSalary,
  type CompanyInsight,
  type CompensationBreakdownSummary,
  type LevelDistribution,
  type SalaryListItem
} from "@/lib/salaries/types";
import { normalizeCompanyName } from "@/lib/salaries/normalization";
import { salaryQuerySchema, type SalaryQueryInput, type SalarySubmissionInput } from "@/lib/salaries/validation";

type RawSearchParams = Record<string, string | string[] | undefined>;

const salarySelect = {
  id: true,
  company: true,
  role: true,
  level: true,
  location: true,
  experience_years: true,
  base_salary: true,
  bonus: true,
  stock: true,
  total_compensation: true,
  confidence_score: true,
  created_at: true
} satisfies Prisma.SalarySelect;

type SelectedSalary = Pick<Salary, keyof typeof salarySelect>;

export async function createSalarySubmission(input: SalarySubmissionInput) {
  const company = normalizeCompanyName(input.company);
  const bonus = input.bonus ?? 0;
  const stock = input.stock ?? 0;
  const totalCompensation = input.baseSalary + bonus + stock;

  const salary = await prisma.salary.create({
    data: {
      company,
      role: input.role,
      level: input.level,
      location: input.location,
      experience_years: input.experienceYears ? Math.round(input.experienceYears) : undefined,
      base_salary: input.baseSalary,
      bonus,
      stock,
      total_compensation: totalCompensation,
      confidence_score: input.confidenceScore
    },
    select: salarySelect
  });

  return mapSalary(salary);
}

export async function listSalaries(rawFilters: RawSearchParams | SalaryQueryInput = {}): Promise<SalaryListItem[]> {
  const filters = salaryQuerySchema.parse(normalizeSearchParams(rawFilters));
  const where = buildSalaryWhere(filters);
  const orderBy = buildSalaryOrderBy(filters.sort);

  const salaries = await withReadFallback(() =>
    prisma.salary.findMany({
      where,
      orderBy,
      select: salarySelect,
      take: 100
    })
  );

  return salaries.map(mapSalary);
}

export async function getCompanyInsights(): Promise<CompanyInsight[]> {
  const grouped = await withReadFallback(() =>
    prisma.salary.groupBy({
      by: ["company"],
      _count: { _all: true },
      _avg: { total_compensation: true },
      orderBy: { _avg: { total_compensation: "desc" } }
    })
  );

  return grouped.map((company) => ({
    company: formatCompanyName(company.company ?? ""),
    normalizedCompany: company.company ?? "",
    submissions: company._count._all,
    averageTotalCompensation: Math.round(company._avg.total_compensation ?? 0)
  }));
}

export async function listComparableSalaries(): Promise<ComparableSalary[]> {
  const salaries = await listSalaries({ sort: "totalCompensation:desc" });

  return salaries.map(({ createdAt, normalizedCompany, ...salary }) => ({
    ...salary,
    company: formatCompanyName(normalizedCompany)
  }));
}

export async function getCompanyDetail(company: string) {
  const normalizedCompany = normalizeCompanyName(company);
  const salaries = await listSalaries({ company: normalizedCompany, sort: "totalCompensation:desc" });

  if (salaries.length === 0) {
    return null;
  }

  const averageTotalCompensation = Math.round(
    salaries.reduce((sum, salary) => sum + salary.totalCompensation, 0) / salaries.length
  );

  return {
    company: formatCompanyName(normalizedCompany),
    normalizedCompany,
    submissions: salaries.length,
    averageTotalCompensation,
    medianTotalCompensation: calculateMedian(salaries.map((salary) => salary.totalCompensation)),
    levelDistribution: calculateLevelDistribution(salaries),
    compensationBreakdown: calculateCompensationBreakdown(salaries),
    salaries
  };
}

export async function compareSalaries(rawFilters: RawSearchParams) {
  const companyA = firstValue(rawFilters.companyA);
  const companyB = firstValue(rawFilters.companyB);
  const sharedFilters = {
    role: firstValue(rawFilters.role),
    level: firstValue(rawFilters.level),
    location: firstValue(rawFilters.location)
  };

  const companies = [companyA, companyB].filter(Boolean) as string[];

  if (companies.length === 0) {
    return [];
  }

  return Promise.all(
    companies.map(async (company) => {
      const normalizedCompany = normalizeCompanyName(company);
      const salaries = await listSalaries({ ...sharedFilters, company: normalizedCompany });
      const averageTotalCompensation =
        salaries.length === 0
          ? 0
          : Math.round(salaries.reduce((sum, salary) => sum + salary.totalCompensation, 0) / salaries.length);

      return {
        label: formatCompanyName(normalizedCompany),
        company: normalizedCompany,
        submissions: salaries.length,
        averageTotalCompensation
      };
    })
  );
}

function buildSalaryWhere(filters: SalaryQueryInput): Prisma.SalaryWhereInput {
  return {
    company: filters.company ? normalizeCompanyName(filters.company) : undefined,
    role: filters.role ? { contains: filters.role, mode: "insensitive" } : undefined,
    level: filters.level,
    location: filters.location ? { contains: filters.location, mode: "insensitive" } : undefined,
    experience_years: {
      gte: filters.minExperience ? Math.round(filters.minExperience) : undefined,
      lte: filters.maxExperience ? Math.round(filters.maxExperience) : undefined
    }
  };
}

function buildSalaryOrderBy(sort = "totalCompensation:desc"): Prisma.SalaryOrderByWithRelationInput {
  const [field, direction] = sort.split(":") as [
    "totalCompensation" | "baseSalary" | "experienceYears" | "createdAt",
    "asc" | "desc"
  ];

  const fieldMap = {
    totalCompensation: "total_compensation",
    baseSalary: "base_salary",
    experienceYears: "experience_years",
    createdAt: "created_at"
  } satisfies Record<typeof field, keyof Prisma.SalaryOrderByWithRelationInput>;

  return { [fieldMap[field]]: direction };
}

function mapSalary(salary: SelectedSalary): SalaryListItem {
  return {
    id: salary.id,
    company: salary.company,
    normalizedCompany: salary.company,
    role: salary.role,
    level: salary.level as SalaryListItem["level"],
    location: salary.location,
    experienceYears: salary.experience_years,
    baseSalary: salary.base_salary,
    bonus: salary.bonus,
    stock: salary.stock,
    totalCompensation: salary.total_compensation,
    confidenceScore: salary.confidence_score ?? 0.75,
    createdAt: salary.created_at
  };
}

function normalizeSearchParams(rawFilters: RawSearchParams | SalaryQueryInput) {
  return Object.fromEntries(
    Object.entries(rawFilters)
      .map(([key, value]) => [key, firstValue(value)])
      .filter(([, value]) => value !== undefined && value !== "")
  );
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function calculateMedian(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  const sortedValues = [...values].sort((left, right) => left - right);
  const middleIndex = Math.floor(sortedValues.length / 2);

  if (sortedValues.length % 2 === 0) {
    return Math.round((sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2);
  }

  return sortedValues[middleIndex];
}

function calculateLevelDistribution(salaries: SalaryListItem[]): LevelDistribution[] {
  const counts = salaries.reduce<Record<string, number>>((accumulator, salary) => {
    accumulator[salary.level] = (accumulator[salary.level] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .map(([level, count]) => ({ level: level as LevelDistribution["level"], count }))
    .sort((left, right) => left.level.localeCompare(right.level));
}

function calculateCompensationBreakdown(salaries: SalaryListItem[]): CompensationBreakdownSummary {
  const totals = salaries.reduce(
    (accumulator, salary) => ({
      baseSalary: accumulator.baseSalary + salary.baseSalary,
      bonus: accumulator.bonus + salary.bonus,
      stock: accumulator.stock + salary.stock,
      totalCompensation: accumulator.totalCompensation + salary.totalCompensation
    }),
    { baseSalary: 0, bonus: 0, stock: 0, totalCompensation: 0 }
  );

  return {
    averageBaseSalary: Math.round(totals.baseSalary / salaries.length),
    averageBonus: Math.round(totals.bonus / salaries.length),
    averageStock: Math.round(totals.stock / salaries.length),
    averageTotalCompensation: Math.round(totals.totalCompensation / salaries.length)
  };
}

async function withReadFallback<T>(query: () => Promise<T[]>): Promise<T[]> {
  try {
    return await query();
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return [];
    }

    throw error;
  }
}

function isDatabaseUnavailable(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.name === "PrismaClientInitializationError" ||
    error.message.includes("Can't reach database server") ||
    error.message.includes("Environment variable not found: DATABASE_URL") ||
    error.message.includes("does not exist")
  );
}
