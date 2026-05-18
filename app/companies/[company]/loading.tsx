export default function CompanyDetailLoading() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-line" />
        <div className="h-8 w-48 animate-pulse rounded bg-line" />
        <div className="h-5 w-80 max-w-full animate-pulse rounded bg-line" />
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded border border-line bg-panel" />
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="h-56 animate-pulse rounded border border-line bg-panel" />
        <div className="h-56 animate-pulse rounded border border-line bg-panel" />
      </section>
      <div className="h-72 animate-pulse rounded border border-line bg-panel" />
    </div>
  );
}
