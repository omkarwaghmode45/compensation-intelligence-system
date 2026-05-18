"use client";

import { useMemo, useState } from "react";
import { formatInr } from "@/lib/formatters/currency";
import type { ComparableSalary } from "@/lib/salaries/types";

type CompensationField = {
  key: "baseSalary" | "bonus" | "stock" | "totalCompensation";
  label: string;
};

const compensationFields: CompensationField[] = [
  { key: "baseSalary", label: "Base salary" },
  { key: "bonus", label: "Bonus" },
  { key: "stock", label: "Stock" },
  { key: "totalCompensation", label: "Total compensation" }
];

const detailFields = [
  { key: "company", label: "Company" },
  { key: "role", label: "Role" },
  { key: "level", label: "Level" }
] as const;

export function CompareSalaryClient({ salaries }: { salaries: ComparableSalary[] }) {
  const [leftId, setLeftId] = useState(salaries[0]?.id ?? "");
  const [rightId, setRightId] = useState(salaries[1]?.id ?? "");

  const leftSalary = useMemo(() => salaries.find((salary) => salary.id === leftId), [leftId, salaries]);
  const rightSalary = useMemo(() => salaries.find((salary) => salary.id === rightId), [rightId, salaries]);

  if (salaries.length === 0) {
    return (
      <div className="rounded border border-dashed border-line bg-panel px-6 py-12 text-center">
        <h2 className="text-lg font-semibold text-ink">No salary records yet</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
          Add salary submissions or run the Prisma seed script to compare compensation packages by company, role, and
          level.
        </p>
      </div>
    );
  }

  if (salaries.length === 1) {
    return (
      <div className="rounded border border-line bg-panel px-6 py-12 text-center">
        <h2 className="text-lg font-semibold text-ink">One more salary record needed</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
          The compare view needs at least two salary entries. Add another submission to unlock the side-by-side view.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
        <SalarySelector
          label="First salary"
          salaries={salaries}
          value={leftId}
          blockedValue={rightId}
          onChange={setLeftId}
        />
        <div className="hidden h-10 items-center px-1 text-sm font-semibold text-slate-500 lg:flex">vs</div>
        <SalarySelector
          label="Second salary"
          salaries={salaries}
          value={rightId}
          blockedValue={leftId}
          onChange={setRightId}
        />
      </section>

      {leftSalary && rightSalary ? (
        <>
          <DifferenceSummary leftSalary={leftSalary} rightSalary={rightSalary} />
          <div className="grid gap-4 lg:grid-cols-2">
            <SalarySnapshot salary={leftSalary} align="left" />
            <SalarySnapshot salary={rightSalary} align="right" />
          </div>
          <ComparisonTable leftSalary={leftSalary} rightSalary={rightSalary} />
        </>
      ) : (
        <div className="rounded border border-dashed border-line p-8 text-center text-sm text-slate-600">
          Select two salary entries to compare.
        </div>
      )}
    </div>
  );
}

function SalarySelector({
  label,
  salaries,
  value,
  blockedValue,
  onChange
}: {
  label: string;
  salaries: ComparableSalary[];
  value: string;
  blockedValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded border border-line bg-white px-3 py-3 text-sm text-ink shadow-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      >
        {salaries.map((salary) => (
          <option key={salary.id} value={salary.id} disabled={salary.id === blockedValue}>
            {formatSalaryOption(salary)}
          </option>
        ))}
      </select>
    </label>
  );
}

function DifferenceSummary({
  leftSalary,
  rightSalary
}: {
  leftSalary: ComparableSalary;
  rightSalary: ComparableSalary;
}) {
  const difference = rightSalary.totalCompensation - leftSalary.totalCompensation;
  const absoluteDifference = Math.abs(difference);
  const percentDifference =
    leftSalary.totalCompensation === 0 ? 0 : (absoluteDifference / leftSalary.totalCompensation) * 100;
  const leader =
    difference === 0
      ? "Both packages are equal"
      : `${difference > 0 ? rightSalary.company : leftSalary.company} is higher`;

  return (
    <section className="rounded border border-line bg-ink p-5 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-300">Total compensation difference</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{leader}</h2>
        </div>
        <div className="text-left md:text-right">
          <p className="text-3xl font-semibold">{formatInr(absoluteDifference)}</p>
          <p className="mt-1 text-sm text-slate-300">{percentDifference.toFixed(1)}% difference</p>
        </div>
      </div>
    </section>
  );
}

function SalarySnapshot({ salary, align }: { salary: ComparableSalary; align: "left" | "right" }) {
  return (
    <section className="rounded border border-line p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">{salary.company}</p>
          <h2 className="mt-1 text-xl font-semibold text-ink">{salary.role}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {salary.level} · {salary.location} · {salary.experienceYears} yrs exp
          </p>
        </div>
        <div className={align === "right" ? "text-right" : "text-left"}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confidence</p>
          <p className="mt-1 font-semibold">{Math.round(salary.confidenceScore * 100)}%</p>
        </div>
      </div>
      <div className="mt-5 rounded bg-panel p-4">
        <p className="text-sm font-medium text-slate-600">Total compensation</p>
        <p className="mt-1 text-3xl font-semibold text-ink">{formatInr(salary.totalCompensation)}</p>
      </div>
    </section>
  );
}

function ComparisonTable({
  leftSalary,
  rightSalary
}: {
  leftSalary: ComparableSalary;
  rightSalary: ComparableSalary;
}) {
  return (
    <section className="overflow-hidden rounded border border-line">
      <div className="border-b border-line bg-panel px-4 py-3">
        <h2 className="font-semibold text-ink">Side-by-side breakdown</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-white text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3">{leftSalary.company}</th>
              <th className="px-4 py-3">{rightSalary.company}</th>
              <th className="px-4 py-3 text-right">Second vs first</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {detailFields.map((field) => (
              <tr key={field.key}>
                <td className="px-4 py-3 font-medium text-slate-700">{field.label}</td>
                <td className="px-4 py-3">{leftSalary[field.key]}</td>
                <td className="px-4 py-3">{rightSalary[field.key]}</td>
                <td className="px-4 py-3 text-right text-slate-500">-</td>
              </tr>
            ))}
            {compensationFields.map((field) => {
              const difference = rightSalary[field.key] - leftSalary[field.key];

              return (
                <tr key={field.key}>
                  <td className="px-4 py-3 font-medium text-slate-700">{field.label}</td>
                  <td className="px-4 py-3">{formatInr(leftSalary[field.key])}</td>
                  <td className="px-4 py-3">{formatInr(rightSalary[field.key])}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={differenceClassName(difference)}>{formatSignedInr(difference)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatSalaryOption(salary: ComparableSalary) {
  return `${salary.company} · ${salary.role} · ${salary.level} · ${formatInr(salary.totalCompensation)}`;
}

function formatSignedInr(value: number) {
  if (value === 0) {
    return formatInr(0);
  }

  return `${value > 0 ? "+" : "-"}${formatInr(Math.abs(value))}`;
}

function differenceClassName(value: number) {
  if (value > 0) {
    return "font-semibold text-emerald-700";
  }

  if (value < 0) {
    return "font-semibold text-red-700";
  }

  return "font-semibold text-slate-600";
}
