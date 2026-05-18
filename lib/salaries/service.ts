import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatCompanyName } from "@/lib/formatters/company";
import { displayCompanyName, normalizeCompanyName } from "@/lib/salaries/normalization";
import type {
  ComparableSalary,
  CompanyInsight,
  CompensationBreakdownSummary,
  LevelDistribution,
  SalaryListItem
} from "@/lib/salaries/types";
import { salaryQuerySchema, type SalaryQueryInput, type SalarySubmissionInput } from "@/lib/salaries/validation";

type RawSearchParams = Record<string, string | string[] | undefined>;

const salarySelect = {
  id: true,
  company: true,
  normalizedCompany: true,
  role: true,
  level: true,
  location: true,
  experienceYears: true,
  baseSalary: true,
  bonus: true,
  stock: true,
  totalCompensation: true,
  confidenceScore: true,
  createdAt: true
} satisfies Prisma.SalarySubmissionSelect;

export async function createSalarySubmission(input: SalarySubmissionInput) {
  const bonus = input.bonus ?? 0;
  const stock = input.stock ?? 0;
  const totalCompensation = input.baseSalary + bonus + stock;

  return prisma.salarySubmission.create({
    data: {
      ...input,
      bonus,
      stock,
      totalCompensation,
      normalizedCompany: normalizeCompanyName(input.company)
    },
    select: salarySelect
  });
}

export async function listSalaries(rawFilters: RawSearchParams | SalaryQueryInput = {}): Promise<SalaryListItem[]> {
  const filters = salaryQuerySchema.parse(normalizeSearchParams(rawFilters));
  const where = buildSalaryWhere(filters);
  const orderBy = buildSalaryOrderBy(filters.sort);

  return withReadFallback(() =>
    prisma.salarySubmission.findMany({
      where,
      orderBy,
      select: salarySelect,
      take: 100
    })
  );
}

export async function getCompanyInsights(): Promise<CompanyInsight[]> {
  const grouped = await withReadFallback(() =>
    prisma.salarySubmission.groupBy({
      by: ["normalizedCompany"],
      _count: { _all: true },
      _avg: { totalCompensation: true },
      orderBy: { _avg: { totalCompensation: "desc" } }
    })
  );

  return grouped.map((company) => ({
    company: displayCompanyName(company.normalizedCompany),
    normalizedCompany: company.normalizedCompany,
    submissions: company._count._all,
    averageTotalCompensation: Math.round(company._avg.totalCompensation ?? 0)
  }));
}

export async function listComparableSalaries(): Promise<ComparableSalary[]> {
  const salaries = await listSalaries({ sort: "totalCompensation:desc" });

  return salaries.map(({ createdAt, normalizedCompany, ...salary }) => ({
    ...salary,
    company: formatCompanyName(normalizedCompany)
  }));
}

export async function getCompanyDetail(normalizedCompany: string) {
  const salaries = await listSalaries({ company: normalizedCompany, sort: "totalCompensation:desc" });

  if (salaries.length === 0) {
    return null;
  }

  const averageTotalCompensation = Math.round(
    salaries.reduce((sum, salary) => sum + salary.totalCompensation, 0) / salaries.length
  );

  return {
    company: displayCompanyName(normalizedCompany),
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
      const salaries = await listSalaries({ ...sharedFilters, company });
      const averageTotalCompensation =
        salaries.length === 0
          ? 0
          : Math.round(salaries.reduce((sum, salary) => sum + salary.totalCompensation, 0) / salaries.length);

      return {
        label: displayCompanyName(normalizeCompanyName(company)),
        company: normalizeCompanyName(company),
        submissions: salaries.length,
        averageTotalCompensation
      };
    })
  );
}

function buildSalaryWhere(filters: SalaryQueryInput): Prisma.SalarySubmissionWhereInput {
  return {
    normalizedCompany: filters.company ? normalizeCompanyName(filters.company) : undefined,
    role: filters.role ? { contains: filters.role, mode: "insensitive" } : undefined,
    level: filters.level,
    location: filters.location ? { contains: filters.location, mode: "insensitive" } : undefined,
    experienceYears: {
      gte: filters.minExperience,
      lte: filters.maxExperience
    }
  };
}

function buildSalaryOrderBy(sort = "totalCompensation:desc"): Prisma.SalarySubmissionOrderByWithRelationInput {
  const [field, direction] = sort.split(":") as [
    "totalCompensation" | "baseSalary" | "experienceYears" | "createdAt",
    "asc" | "desc"
  ];

  return { [field]: direction };
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
    error.message.includes("Environment variable not found: DATABASE_URL")
  );
}
