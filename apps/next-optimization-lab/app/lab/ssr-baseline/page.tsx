import { LabShell } from "@/components/lab-shell";
import { MetricsPanel } from "@/components/metrics-panel";
import { ProductList } from "@/components/product-list";
import { getAllProducts } from "@/lib/db";
import { getTimestamp, createTimer } from "@/lib/timing";

/**
 * SSR BASELINE - The Unoptimized Starting Point
 *
 * This lab demonstrates what happens with NO caching.
 * Every request fetches fresh data from the "database".
 *
 * Key characteristics:
 * - cache: 'no-store' (or equivalent dynamic rendering)
 * - Slowest TTFB because every request waits for data
 * - Use this as a baseline to compare other optimizations
 *
 * When to use in production:
 * - Real-time data that must be fresh (stock prices, live scores)
 * - Personalized content that can't be shared between users
 * - When stale data would cause business problems
 */

// Force dynamic rendering - this page will never be cached
export const dynamic = "force-dynamic";

export default async function SSRBaselinePage() {
  const timer = createTimer();

  // Simulate a slow database query (500ms delay)
  // In production, this would be actual DB latency
  const products = await getAllProducts(500);

  const renderTimeMs = timer.elapsed();
  const fetchedAt = getTimestamp();

  return (
    <LabShell
      title="SSR Baseline (No Cache)"
      description="Every request fetches fresh data. This is the slowest but most fresh option."
      concept="Using cache: 'no-store' or dynamic = 'force-dynamic' opts out of all caching. The server fetches data on every single request. This gives you the freshest data but at the cost of higher latency and server load."
      codeExample={`// Option 1: At the page level
export const dynamic = 'force-dynamic';

// Option 2: At the fetch level
const res = await fetch(url, { cache: 'no-store' });

// Option 3: Implicit via cookies/headers
import { cookies } from 'next/headers';
const session = cookies().get('session');`}
      tips={[
        "Check your terminal - you'll see this page fetch on every refresh",
        "Compare the TTFB here vs the cached labs",
        "This is a good choice for authenticated dashboards",
      ]}
      warnings={[
        "Using cookies() or headers() automatically makes a route dynamic",
        "Every visitor hits your database - consider rate limiting",
        "If data isn't truly real-time, consider revalidate instead",
      ]}
    >
      {/* Metrics Panel */}
      <MetricsPanel
        metrics={{
          fetchCount: 1,
          renderTimeMs,
          cacheMode: "no-store",
          lastUpdated: fetchedAt,
          notes:
            "Data fetched fresh on every request. Refresh the page to see a new timestamp.",
        }}
      />

      {/* Product Grid */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Products (Fetched at {new Date(fetchedAt).toLocaleTimeString()})
        </h2>
        <ProductList products={products} />
      </div>
    </LabShell>
  );
}
