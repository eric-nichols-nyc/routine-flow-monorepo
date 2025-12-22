import { LabShell } from "@/components/lab-shell";
import { MetricsPanel } from "@/components/metrics-panel";
import { ProductList } from "@/components/product-list";
import { getAllProducts, getFeaturedProducts, getAllUsers } from "@/lib/db";
import { getTimestamp, createTimer, measureAsync } from "@/lib/timing";

/**
 * PARALLEL VS WATERFALL - Data Fetching Patterns
 *
 * This lab demonstrates the performance difference between
 * sequential (waterfall) and parallel data fetching.
 *
 * Key characteristics:
 * - Sequential: await A, then await B, then await C
 * - Parallel: await Promise.all([A, B, C])
 * - Parallel is faster because requests happen simultaneously
 *
 * When to use parallel:
 * - When fetches are independent of each other
 * - When you need multiple datasets for a page
 * - Almost always, unless there's a dependency
 */

// Force dynamic to ensure fresh timing on each request
export const dynamic = "force-dynamic";

export default async function ParallelVsWaterfallPage() {
  const overallTimer = createTimer();

  // ========================================
  // WATERFALL: Sequential fetches (SLOW)
  // Each await blocks the next fetch
  // ========================================
  const waterfallTimer = createTimer();

  const waterfallProducts = await getAllProducts(300); // 300ms
  const waterfallFeatured = await getFeaturedProducts(3, 200); // 200ms
  const waterfallUsers = await getAllUsers(200); // 200ms
  // Total: 300 + 200 + 200 = 700ms minimum

  const waterfallTime = waterfallTimer.elapsed();

  // ========================================
  // PARALLEL: Concurrent fetches (FAST)
  // All fetches happen at the same time
  // ========================================
  const parallelTimer = createTimer();

  const [parallelProducts, parallelFeatured, parallelUsers] = await Promise.all(
    [
      getAllProducts(300), // 300ms
      getFeaturedProducts(3, 200), // 200ms
      getAllUsers(200), // 200ms
    ],
  );
  // Total: max(300, 200, 200) = 300ms minimum

  const parallelTime = parallelTimer.elapsed();

  const overallTime = overallTimer.elapsed();
  const fetchedAt = getTimestamp();

  // Calculate the speed improvement
  const speedImprovement = Math.round((1 - parallelTime / waterfallTime) * 100);

  return (
    <LabShell
      title="Parallel vs Waterfall"
      description="Compare sequential awaits with Promise.all for independent data fetches."
      concept="When you have multiple independent data fetches, using Promise.all() runs them in parallel. This can dramatically reduce total wait time. The total time becomes the longest fetch, not the sum of all fetches."
      codeExample={`// ❌ WATERFALL (Slow)
// Each fetch waits for the previous one
const products = await getProducts();   // 300ms
const users = await getUsers();         // 200ms
const reviews = await getReviews();     // 200ms
// Total: 700ms

// ✅ PARALLEL (Fast)
// All fetches run simultaneously
const [products, users, reviews] = await Promise.all([
  getProducts(),   // 300ms ─┐
  getUsers(),      // 200ms ─┼─ Run in parallel
  getReviews(),    // 200ms ─┘
]);
// Total: 300ms (slowest fetch)`}
      tips={[
        "Look at the timing comparison below - parallel is significantly faster",
        "Use Promise.all when fetches don't depend on each other",
        "In RSC, you can also use parallel component rendering for the same effect",
      ]}
      warnings={[
        "If fetch B needs data from fetch A, you must use waterfall",
        "Promise.all fails fast - one rejection fails all",
        "Consider Promise.allSettled if you want partial results on failure",
      ]}
    >
      {/* Timing Comparison */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Waterfall Metrics */}
        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
          <h3 className="font-semibold text-red-400 mb-3">
            ❌ Waterfall (Sequential)
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Products fetch</span>
              <span className="text-zinc-200">~300ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Featured fetch</span>
              <span className="text-zinc-200">~200ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Users fetch</span>
              <span className="text-zinc-200">~200ms</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-red-500/20">
              <span className="text-red-400 font-medium">Total Time</span>
              <span className="text-red-400 font-bold">{waterfallTime}ms</span>
            </div>
          </div>
        </div>

        {/* Parallel Metrics */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <h3 className="font-semibold text-emerald-400 mb-3">
            ✅ Parallel (Promise.all)
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Products fetch</span>
              <span className="text-zinc-200">~300ms ━━━━</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Featured fetch</span>
              <span className="text-zinc-200">~200ms ━━━</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Users fetch</span>
              <span className="text-zinc-200">~200ms ━━━</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-emerald-500/20">
              <span className="text-emerald-400 font-medium">Total Time</span>
              <span className="text-emerald-400 font-bold">
                {parallelTime}ms
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Speed Improvement Badge */}
      <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/20">
        <p className="text-center">
          <span className="text-2xl font-bold text-amber-400">
            {speedImprovement}%
          </span>
          <span className="text-zinc-400 ml-2">
            faster with parallel fetching
          </span>
        </p>
      </div>

      {/* Metrics Panel */}
      <MetricsPanel
        metrics={{
          fetchCount: 6, // 3 waterfall + 3 parallel
          renderTimeMs: overallTime,
          cacheMode: "no-store",
          lastUpdated: fetchedAt,
          notes: `Waterfall: ${waterfallTime}ms | Parallel: ${parallelTime}ms | Saved: ${waterfallTime - parallelTime}ms`,
        }}
      />

      {/* Products from Parallel Fetch */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Products (from parallel fetch)
        </h2>
        <ProductList products={parallelProducts} />
      </div>
    </LabShell>
  );
}
