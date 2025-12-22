import { LabShell } from "@/components/lab-shell";
import { MetricsPanel } from "@/components/metrics-panel";
import { ProductList } from "@/components/product-list";
import { getTimestamp, createTimer } from "@/lib/timing";
import type { Product } from "@/lib/types";

/**
 * FETCH CACHING - Time-Based Revalidation
 *
 * This lab demonstrates Stale-While-Revalidate caching.
 * Data is cached for N seconds, then revalidated in the background.
 *
 * Key characteristics:
 * - next: { revalidate: 30 } caches for 30 seconds
 * - After 30 seconds, next request serves stale while fetching fresh
 * - Subsequent requests get the fresh data
 *
 * When to use in production:
 * - Product catalogs (updates every few minutes is fine)
 * - Blog posts, news articles
 * - Any data where slight staleness is acceptable
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";

async function getProducts(): Promise<{
  products: Product[];
  fetchedAt: string;
}> {
  const res = await fetch(`${API_URL}/api/products?delay=500`, {
    // Revalidate every 30 seconds
    // After 30s, the next request triggers a background refresh
    next: { revalidate: 30 },
  });

  if (!res.ok) throw new Error("Failed to fetch");

  const products = await res.json();
  return {
    products,
    fetchedAt: getTimestamp(),
  };
}

export default async function FetchCachingPage() {
  const timer = createTimer();

  const { products, fetchedAt } = await getProducts();

  const renderTimeMs = timer.elapsed();

  return (
    <LabShell
      title="Fetch Caching (Revalidate)"
      description="Data is cached and revalidated every 30 seconds using Stale-While-Revalidate."
      concept="The first request after 30 seconds will serve stale data immediately while fetching fresh data in the background. This gives users instant responses while keeping data reasonably fresh. Perfect for data that changes occasionally."
      codeExample={`// Revalidate every 30 seconds
const res = await fetch(url, {
  next: { revalidate: 30 }
});

// Or at the page/segment level
export const revalidate = 30;

// The flow:
// 1. First request: fetch & cache
// 2. Next 30 seconds: serve from cache (instant!)
// 3. After 30 seconds: serve stale, revalidate in background
// 4. Next request: serve fresh cached data`}
      tips={[
        "Refresh multiple times quickly - notice the timestamp doesn't change",
        "Wait 30+ seconds, then refresh - still instant, but timestamp updates next time",
        "Check the Next.js terminal logs to see when actual fetches happen",
      ]}
      warnings={[
        "revalidate: 0 is the same as no-store (no caching)",
        "If your data changes frequently, use shorter windows",
        "For on-demand updates after mutations, use tags instead",
      ]}
    >
      {/* Metrics Panel */}
      <MetricsPanel
        metrics={{
          fetchCount: 1,
          renderTimeMs,
          cacheMode: "revalidate",
          lastUpdated: fetchedAt,
          notes:
            "Data cached for 30 seconds. Refresh multiple times - timestamp stays the same until revalidation.",
        }}
      />

      {/* Revalidation Timer Visual */}
      <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-sm text-blue-400">
          <strong>Revalidation window:</strong> 30 seconds
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          Data fetched at:{" "}
          <span className="text-zinc-200">
            {new Date(fetchedAt).toLocaleTimeString()}
          </span>
        </p>
        <p className="text-xs text-zinc-400">
          Next revalidation possible after:{" "}
          <span className="text-zinc-200">
            {new Date(
              new Date(fetchedAt).getTime() + 30000,
            ).toLocaleTimeString()}
          </span>
        </p>
      </div>

      {/* Product Grid */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Cached Products
        </h2>
        <ProductList products={products} />
      </div>
    </LabShell>
  );
}
