export default function CompaniesLoading() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <div className="h-4 w-36 animate-pulse rounded bg-line" />
        <div className="h-8 w-56 animate-pulse rounded bg-line" />
        <div className="h-5 max-w-2xl animate-pulse rounded bg-line" />
      </section>
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded border border-line bg-panel" />
        ))}
      </div>
    </div>
  );
}
