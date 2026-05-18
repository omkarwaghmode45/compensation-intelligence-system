export default function CompareLoading() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <div className="h-4 w-32 animate-pulse rounded bg-line" />
        <div className="h-8 w-64 animate-pulse rounded bg-line" />
        <div className="h-5 max-w-2xl animate-pulse rounded bg-line" />
      </section>
      <section className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
        <div className="h-20 animate-pulse rounded border border-line bg-panel" />
        <div className="hidden h-10 w-8 animate-pulse rounded bg-line lg:block" />
        <div className="h-20 animate-pulse rounded border border-line bg-panel" />
      </section>
      <div className="h-28 animate-pulse rounded border border-line bg-ink/90" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-48 animate-pulse rounded border border-line bg-panel" />
        <div className="h-48 animate-pulse rounded border border-line bg-panel" />
      </div>
      <div className="h-72 animate-pulse rounded border border-line bg-panel" />
    </div>
  );
}
