export function LoadingSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-800 rounded" />
      ))}
    </div>
  );
}

export function StatsBarSkeleton() {
  return (
    <div className="animate-pulse flex gap-6 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-6 w-32 bg-gray-800 rounded" />
      ))}
    </div>
  );
}
