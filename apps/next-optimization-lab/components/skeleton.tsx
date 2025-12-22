/**
 * Skeleton components for loading states
 * Used in Suspense boundaries to show immediate shell
 */

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-square rounded-xl bg-zinc-800 mb-4" />

      {/* Title */}
      <div className="h-5 bg-zinc-800 rounded-lg w-3/4 mb-3" />

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-zinc-800 rounded-lg w-full" />
        <div className="h-3 bg-zinc-800 rounded-lg w-2/3" />
      </div>

      {/* Price row */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-zinc-800 rounded-lg w-20" />
        <div className="h-4 bg-zinc-800 rounded-lg w-16" />
      </div>
    </div>
  );
}

export function ProductListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductListItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 animate-pulse">
      <div className="w-16 h-16 rounded-lg bg-zinc-800" />
      <div className="flex-1">
        <div className="h-5 bg-zinc-800 rounded-lg w-1/2 mb-2" />
        <div className="h-3 bg-zinc-800 rounded-lg w-3/4" />
      </div>
      <div className="text-right">
        <div className="h-5 bg-zinc-800 rounded-lg w-16 mb-1" />
        <div className="h-4 bg-zinc-800 rounded-lg w-12" />
      </div>
    </div>
  );
}

export function MetricsPanelSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse">
      <div className="h-5 bg-zinc-800 rounded-lg w-32 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-3 rounded-xl bg-zinc-800/50">
            <div className="h-3 bg-zinc-700 rounded w-12 mb-2" />
            <div className="h-7 bg-zinc-700 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
