import { CompareSalaryClient } from "@/components/compare-salary-client";
import { listComparableSalaries } from "@/lib/salaries/service";

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const salaries = await listComparableSalaries();

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Compare offers</p>
        <h1 className="text-2xl font-semibold tracking-tight">Salary Comparison</h1>
        <p className="max-w-2xl text-slate-600">
          Pick two compensation entries and compare level, role, and pay breakdown side by side.
        </p>
      </section>
      <CompareSalaryClient salaries={salaries} />
    </div>
  );
}
