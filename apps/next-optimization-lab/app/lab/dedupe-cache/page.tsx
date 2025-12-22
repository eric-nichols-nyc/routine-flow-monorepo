import { LabShell } from "@/components/lab-shell";
import { MetricsPanel } from "@/components/metrics-panel";
import {
  getCachedProducts,
  getCachedFeaturedProducts,
  getCachedProductStats,
} from "@/lib/cache";
import { getTimestamp, createTimer } from "@/lib/timing";
import { Package, TrendingUp, DollarSign, Star } from "lucide-react";

/**
 * DEDUPE WITH CACHE() - Request-Level Deduplication
 *
 * This lab demonstrates React's cache() function.
 * Multiple components can call the same function, but it only executes once per request.
 *
 * Key characteristics:
 * - cache() wraps a function to memoize results PER REQUEST
 * - Different from Next.js fetch cache (which persists across requests)
 * - Great for when multiple components need the same data
 *
 * When to use:
 * - Multiple Server Components need the same data
 * - You want to avoid prop drilling
 * - Layout and page both need user data
 */

// Force dynamic to show fresh logs each time
export const dynamic = "force-dynamic";

// ========================================
// MULTIPLE COMPONENTS CALLING SAME CACHED FUNCTION
// ========================================

async function ProductCount() {
  // This calls getCachedProducts - but it's deduped!
  const products = await getCachedProducts();

  return (
    <div className="p-4 rounded-xl bg-zinc-800/50">
      <div className="flex items-center gap-2 mb-2">
        <Package className="w-5 h-5 text-emerald-400" />
        <span className="text-sm text-zinc-400">Total Products</span>
      </div>
      <p className="text-2xl font-bold text-zinc-100">{products.length}</p>
      <p className="text-xs text-emerald-400 mt-1">✓ Used cached data</p>
    </div>
  );
}

async function ProductStats() {
  // getCachedProductStats internally calls getCachedProducts too!
  // It's still deduped - only one actual DB call
  const stats = await getCachedProductStats();

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 rounded-xl bg-zinc-800/50">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <span className="text-sm text-zinc-400">In Stock</span>
        </div>
        <p className="text-2xl font-bold text-zinc-100">{stats.inStockCount}</p>
      </div>
      <div className="p-4 rounded-xl bg-zinc-800/50">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-5 h-5 text-amber-400" />
          <span className="text-sm text-zinc-400">Avg Price</span>
        </div>
        <p className="text-2xl font-bold text-zinc-100">
          ${stats.averagePrice.toFixed(2)}
        </p>
      </div>
      <div className="p-4 rounded-xl bg-zinc-800/50">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="text-sm text-zinc-400">Avg Rating</span>
        </div>
        <p className="text-2xl font-bold text-zinc-100">
          {stats.averageRating.toFixed(1)}
        </p>
      </div>
    </div>
  );
}

async function FeaturedSection() {
  // Another call to getCachedFeaturedProducts
  const featured = await getCachedFeaturedProducts(3);

  return (
    <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
      <h3 className="font-semibold text-emerald-400 mb-3">Featured Products</h3>
      <div className="space-y-2">
        {featured.map((product) => (
          <div key={product.id} className="flex items-center justify-between">
            <span className="text-zinc-200">{product.name}</span>
            <span className="text-zinc-400">${product.price}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-emerald-400 mt-3">✓ Used cached data</p>
    </div>
  );
}

async function AnotherProductCount() {
  // SAME call as ProductCount - will be deduped
  const products = await getCachedProducts();

  return (
    <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
      <p className="text-sm text-violet-400">
        Another component calling getCachedProducts():
      </p>
      <p className="text-xl font-bold text-zinc-100 mt-2">
        {products.length} products
      </p>
      <p className="text-xs text-violet-400 mt-1">
        ✓ Deduped! Same cache() call as above
      </p>
    </div>
  );
}

export default async function DedupeCachePage() {
  const timer = createTimer();
  const fetchedAt = getTimestamp();

  // Call it from the page too - still deduped!
  const products = await getCachedProducts();

  const renderTimeMs = timer.elapsed();

  return (
    <LabShell
      title="Dedupe with cache()"
      description="Multiple components call the same function, but it only executes once per request."
      concept="React's cache() function memoizes results for the duration of a single request. This means multiple Server Components can independently fetch the same data without causing duplicate database calls. It's like having a request-scoped cache."
      codeExample={`// lib/cache.ts
import { cache } from 'react';
import { getAllProducts } from './db';

// Wrap your data fetching function with cache()
export const getCachedProducts = cache(async () => {
  console.log('This log appears ONCE per request');
  return getAllProducts();
});

// Now multiple components can call it independently
function ProductCount() {
  const products = await getCachedProducts(); // First call - hits DB
  return <p>{products.length} products</p>;
}

function ProductList() {
  const products = await getCachedProducts(); // Second call - uses cached!
  return <ul>...</ul>;
}

// Both components render with ONE database query!`}
      tips={[
        "Check your terminal - you'll see '[cache.ts] getCachedProducts called' only ONCE",
        "This works for any function, not just fetch",
        "Great for avoiding prop drilling in Server Components",
      ]}
      warnings={[
        "cache() only works for the duration of ONE request",
        "It's different from Next.js fetch cache (which persists across requests)",
        "Only works in Server Components (React Server Components)",
      ]}
    >
      {/* Visual Explanation */}
      <div className="mb-8 p-5 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <h3 className="font-semibold text-amber-400 mb-3">
          What's Happening Below
        </h3>
        <p className="text-sm text-zinc-400 mb-2">
          All of these components call{" "}
          <code className="text-amber-400">getCachedProducts()</code>:
        </p>
        <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
          <li>ProductCount component</li>
          <li>
            ProductStats component (internally calls getCachedProducts too)
          </li>
          <li>AnotherProductCount component</li>
          <li>The page itself</li>
        </ul>
        <p className="text-sm text-amber-400 mt-3">
          But the database is only queried <strong>ONCE</strong>!
        </p>
      </div>

      {/* Metrics Panel */}
      <MetricsPanel
        metrics={{
          fetchCount: 1, // Thanks to cache()!
          renderTimeMs,
          cacheMode: "deduped",
          lastUpdated: fetchedAt,
          notes:
            "Multiple components call getCachedProducts(), but only 1 DB query executes.",
        }}
      />

      {/* Components Grid */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-zinc-300">
            Component 1: ProductCount
          </h3>
          <ProductCount />
        </div>
        <div className="space-y-4">
          <h3 className="font-medium text-zinc-300">
            Component 2: AnotherProductCount
          </h3>
          <AnotherProductCount />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-zinc-300 mb-4">
          Component 3: ProductStats
        </h3>
        <ProductStats />
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-zinc-300 mb-4">
          Component 4: FeaturedSection
        </h3>
        <FeaturedSection />
      </div>
    </LabShell>
  );
}
