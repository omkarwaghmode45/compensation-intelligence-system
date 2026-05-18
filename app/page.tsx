import { SalaryFilters } from "@/components/salary-filters";
import { SalaryTable } from "@/components/salary-table";
import { listSalaries } from "@/lib/salaries/service";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const salaries = await listSalaries(searchParams);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Level-first compensation data</p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-ink">
          Compare pay by standardized level, company, role, and location.
        </h1>
      </section>
      <SalaryFilters />
      <SalaryTable salaries={salaries} />
    </div>
  );
}
