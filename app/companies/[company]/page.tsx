import { notFound } from "next/navigation";
import { SalaryTable } from "@/components/salary-table";
import { formatCompactInr } from "@/lib/formatters/currency";
import { getCompanyDetail } from "@/lib/salaries/service";

export const dynamic = "force-dynamic";

export default async function CompanyPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const detail = await getCompanyDetail(company);

  if (!detail) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Company</p>
        <h1 className="text-2xl font-semibold tracking-tight">{detail.company}</h1>
        <p className="mt-2 text-slate-600">
          Average total compensation: {formatCompactInr(detail.averageTotalCompensation)} across{" "}
          {detail.submissions} submissions.
        </p>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard label="Average compensation" value={formatCompactInr(detail.averageTotalCompensation)} />
        <MetricCard label="Median compensation" value={formatCompactInr(detail.medianTotalCompensation)} />
        <MetricCard label="Submissions" value={detail.submissions.toLocaleString("en-IN")} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded border border-line p-5">
          <h2 className="font-semibold text-ink">Level distribution</h2>
          <div className="mt-4 space-y-3">
            {detail.levelDistribution.map((item) => (
              <div key={item.level} className="flex items-center justify-between rounded bg-panel px-3 py-2">
                <span className="font-medium">{item.level}</span>
                <span className="text-sm text-slate-600">{item.count} submissions</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded border border-line p-5">
          <h2 className="font-semibold text-ink">Compensation breakdown</h2>
          <div className="mt-4 space-y-4">
            <BreakdownRow
              label="Base salary"
              value={detail.compensationBreakdown.averageBaseSalary}
              total={detail.compensationBreakdown.averageTotalCompensation}
            />
            <BreakdownRow
              label="Bonus"
              value={detail.compensationBreakdown.averageBonus}
              total={detail.compensationBreakdown.averageTotalCompensation}
            />
            <BreakdownRow
              label="Stock"
              value={detail.compensationBreakdown.averageStock}
              total={detail.compensationBreakdown.averageTotalCompensation}
            />
          </div>
        </div>
      </section>

      <SalaryTable salaries={detail.salaries} />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-line bg-panel p-4">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}

function BreakdownRow({ label, value, total }: { label: string; value: number; total: number }) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-semibold text-ink">{formatCompactInr(value)}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded bg-line">
        <div className="h-full rounded bg-accent" style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-500">{percentage}% of average total compensation</p>
    </div>
  );
}
