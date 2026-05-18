import Link from "next/link";
import { formatCompactInr } from "@/lib/formatters/currency";
import { getCompanyInsights } from "@/lib/salaries/service";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const companies = await getCompanyInsights();

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Market snapshots</p>
        <h1 className="text-2xl font-semibold tracking-tight">Company Insights</h1>
        <p className="max-w-2xl text-slate-600">
          Explore company-level compensation signals normalized by level, role, and location.
        </p>
      </section>
      {companies.length === 0 ? (
        <div className="rounded border border-dashed border-line bg-panel p-8 text-center">
          <h2 className="font-semibold text-ink">No company insights yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
            Add salary submissions or run the seed script to populate company-level compensation summaries.
          </p>
        </div>
      ) : null}
      <div className="grid gap-3 md:grid-cols-2">
        {companies.map((company) => (
          <Link
            key={company.normalizedCompany}
            href={`/companies/${company.normalizedCompany}`}
            className="group rounded border border-line p-4 transition hover:border-accent hover:bg-panel"
            aria-label={`Open ${company.company} company insights`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold">{company.company}</h2>
                <p className="text-sm text-slate-600">{company.submissions} {company.submissions === 1 ? "submission" : "submissions"}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCompactInr(company.averageTotalCompensation)}</p>
                <p className="mt-1 text-xs font-medium text-slate-500 group-hover:text-accent">View details</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
