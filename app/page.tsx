import { SalaryExplorer } from "@/components/salary-explorer";
import type { SalaryFilterValues } from "@/components/salary-filters";
import { listSalaries } from "@/lib/salaries/service";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const salaries = await listSalaries(resolvedSearchParams);
  const initialFilters = getInitialFilters(resolvedSearchParams);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Level-first compensation data</p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-ink">
          Compare pay by standardized level, company, role, and location.
        </h1>
      </section>
      <SalaryExplorer initialFilters={initialFilters} initialSalaries={salaries} />
    </div>
  );
}

function getInitialFilters(searchParams: SearchParams): SalaryFilterValues {
  return {
    company: firstValue(searchParams.company) ?? "",
    role: firstValue(searchParams.role) ?? "",
    level: firstValue(searchParams.level) ?? "",
    location: firstValue(searchParams.location) ?? "",
    sort: firstValue(searchParams.sort) ?? "totalCompensation:desc"
  };
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
