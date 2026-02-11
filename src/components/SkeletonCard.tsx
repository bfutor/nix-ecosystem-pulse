export function SkeletonCard({ height = 'h-32' }: { height?: string }) {
  return (
    <div
      className={`${height} rounded-xl border border-border bg-bg-card p-6`}
    >
      <div className="skeleton h-4 w-24 mb-4" />
      <div className="skeleton h-8 w-32 mb-2" />
      <div className="skeleton h-3 w-20" />
    </div>
  );
}

export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-12 w-full" />
      ))}
    </div>
  );
}
