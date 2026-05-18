import type { SalaryListItem } from "@/lib/salaries/types";
import { formatCompanyName } from "@/lib/formatters/company";
import { formatCompactInr } from "@/lib/formatters/currency";

export function SalaryTable({ salaries }: { salaries: SalaryListItem[] }) {
  if (salaries.length === 0) {
    return (
      <div className="rounded border border-dashed border-line p-8 text-center text-slate-600">
        No salaries found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded border border-line">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-panel text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3 text-right">Base</th>
              <th className="px-4 py-3 text-right">Bonus</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {salaries.map((salary) => (
              <tr key={salary.id}>
                <td className="px-4 py-3 font-medium">{formatCompanyName(salary.company)}</td>
                <td className="px-4 py-3">{salary.role}</td>
                <td className="px-4 py-3">{salary.level}</td>
                <td className="px-4 py-3">{salary.location ?? "Remote / unspecified"}</td>
                <td className="px-4 py-3 text-right">{formatCompactInr(salary.baseSalary)}</td>
                <td className="px-4 py-3 text-right">{formatCompactInr(salary.bonus)}</td>
                <td className="px-4 py-3 text-right">{formatCompactInr(salary.stock)}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatCompactInr(salary.totalCompensation)}
                </td>
                <td className="px-4 py-3 text-right">{Math.round(salary.confidenceScore * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
