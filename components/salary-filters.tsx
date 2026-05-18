const levels = ["L3", "L4", "L5", "L6", "L7"];

export function SalaryFilters() {
  return (
    <form className="grid gap-3 rounded border border-line bg-panel p-4 md:grid-cols-5">
      <input name="company" placeholder="Company" className="rounded border border-line px-3 py-2" />
      <input name="role" placeholder="Role" className="rounded border border-line px-3 py-2" />
      <select name="level" className="rounded border border-line px-3 py-2" defaultValue="">
        <option value="">Level</option>
        {levels.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
      <input name="location" placeholder="Location" className="rounded border border-line px-3 py-2" />
      <select name="sort" className="rounded border border-line px-3 py-2" defaultValue="totalCompensation:desc">
        <option value="totalCompensation:desc">Total comp high to low</option>
        <option value="totalCompensation:asc">Total comp low to high</option>
        <option value="experienceYears:desc">Experience high to low</option>
        <option value="createdAt:desc">Newest</option>
      </select>
      <button className="rounded bg-ink px-4 py-2 font-medium text-white md:col-span-5" type="submit">
        Apply filters
      </button>
    </form>
  );
}
