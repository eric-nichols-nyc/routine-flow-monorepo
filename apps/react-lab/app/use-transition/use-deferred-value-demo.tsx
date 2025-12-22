"use client";

import { useState, useDeferredValue, useMemo } from "react";
import { RenderTracker } from "@/components/render-tracker";
import { Search } from "lucide-react";

// Generate a large list of items
const allItems = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i + 1}`,
  category: ["Electronics", "Books", "Clothing", "Food", "Toys"][i % 5],
}));

function SlowList({ query }: { query: string }) {
  const filteredItems = useMemo(() => {
    if (!query) return allItems.slice(0, 100);

    // Simulate expensive filter operation
    const start = performance.now();
    while (performance.now() - start < 100) {
      // Blocking
    }

    return allItems
      .filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 100);
  }, [query]);

  return (
    <div className="space-y-1 max-h-64 overflow-auto">
      {filteredItems.length === 0 ? (
        <p className="text-zinc-500 text-sm">No results found</p>
      ) : (
        filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between py-1 px-2 rounded bg-zinc-800/30 text-sm"
          >
            <span className="text-zinc-300">{item.name}</span>
            <span className="text-zinc-500">{item.category}</span>
          </div>
        ))
      )}
    </div>
  );
}

export function UseDeferredValueDemo() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const isStale = query !== deferredQuery;

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <div className="grid grid-cols-2 gap-6">
        {/* Input */}
        <RenderTracker name="Search Input (Immediate)" color="cyan">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 10,000 items..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Current: <span className="text-cyan-400">"{query}"</span>
          </p>
          <p className="text-xs text-zinc-500">
            Deferred: <span className="text-violet-400">"{deferredQuery}"</span>
          </p>
        </RenderTracker>

        {/* Results */}
        <RenderTracker name="Results List (Deferred)" color="violet">
          <div
            className={`transition-opacity ${isStale ? "opacity-50" : "opacity-100"}`}
          >
            {isStale && (
              <p className="text-xs text-amber-400 mb-2">Updating...</p>
            )}
            <SlowList query={deferredQuery} />
          </div>
        </RenderTracker>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <p className="text-sm text-emerald-400">
          <strong>With useDeferredValue:</strong>
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          Type quickly in the search box. The input stays responsive because the
          expensive list filtering uses a deferred version of the query. Notice
          how the list fades while updating - that's the stale indicator.
        </p>
      </div>
    </div>
  );
}
