"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SalaryFilters, type SalaryFilterValues } from "@/components/salary-filters";
import { SalaryTable } from "@/components/salary-table";
import type { SalaryListItem } from "@/lib/salaries/types";

type SalaryExplorerProps = {
  initialFilters: SalaryFilterValues;
  initialSalaries: SalaryListItem[];
};

export function SalaryExplorer({ initialFilters, initialSalaries }: SalaryExplorerProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<SalaryFilterValues>(initialFilters);
  const [salaries, setSalaries] = useState<SalaryListItem[]>(initialSalaries);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateFilter(field: keyof SalaryFilterValues, value: string) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value
    }));
  }

  async function applyFilters() {
    const queryString = buildSalaryQueryString(filters);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/salaries${queryString ? `?${queryString}` : ""}`, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Unable to load filtered salaries.");
      }

      const payload = (await response.json()) as { data: SalaryListItem[] };
      setSalaries(payload.data);
      router.replace(queryString ? `/?${queryString}` : "/");
    } catch {
      setError("Filters could not be applied. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <SalaryFilters values={filters} isLoading={isLoading} onChange={updateFilter} onSubmit={applyFilters} />
      {error ? <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      <div className={isLoading ? "opacity-60 transition" : "transition"}>
        <SalaryTable salaries={salaries} />
      </div>
    </div>
  );
}

function buildSalaryQueryString(filters: SalaryFilterValues) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      params.set(key, trimmedValue);
    }
  });

  return params.toString();
}
