const levels = ["L3", "L4", "L5", "L6", "L7"];

export type SalaryFilterValues = {
  company: string;
  role: string;
  level: string;
  location: string;
  sort: string;
};

type SalaryFiltersProps = {
  values: SalaryFilterValues;
  isLoading: boolean;
  onChange: (field: keyof SalaryFilterValues, value: string) => void;
  onSubmit: () => void;
};

export function SalaryFilters({ values, isLoading, onChange, onSubmit }: SalaryFiltersProps) {
  return (
    <form
      className="grid gap-3 rounded border border-line bg-panel p-4 md:grid-cols-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        name="company"
        placeholder="Company"
        value={values.company}
        onChange={(event) => onChange("company", event.target.value)}
        className="rounded border border-line px-3 py-2"
      />
      <input
        name="role"
        placeholder="Role"
        value={values.role}
        onChange={(event) => onChange("role", event.target.value)}
        className="rounded border border-line px-3 py-2"
      />
      <select
        name="level"
        className="rounded border border-line px-3 py-2"
        value={values.level}
        onChange={(event) => onChange("level", event.target.value)}
      >
        <option value="">Level</option>
        {levels.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
      <input
        name="location"
        placeholder="Location"
        value={values.location}
        onChange={(event) => onChange("location", event.target.value)}
        className="rounded border border-line px-3 py-2"
      />
      <select
        name="sort"
        className="rounded border border-line px-3 py-2"
        value={values.sort}
        onChange={(event) => onChange("sort", event.target.value)}
      >
        <option value="totalCompensation:desc">Total comp high to low</option>
        <option value="totalCompensation:asc">Total comp low to high</option>
        <option value="experienceYears:desc">Experience high to low</option>
        <option value="createdAt:desc">Newest</option>
      </select>
      <button
        className="rounded bg-ink px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 md:col-span-5"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Applying..." : "Apply filters"}
      </button>
    </form>
  );
}
