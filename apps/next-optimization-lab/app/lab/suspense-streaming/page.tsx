import { Suspense } from "react";
import { LabShell } from "@/components/lab-shell";
import { MetricsPanel } from "@/components/metrics-panel";
import { ProductList } from "@/components/product-list";
import { ProductGridSkeleton } from "@/components/skeleton";
import {
  getAllProducts,
  getFeaturedProducts,
  getReviewsForProduct,
} from "@/lib/db";
import { getTimestamp, createTimer } from "@/lib/timing";

/**
 * SUSPENSE STREAMING - Progressive Rendering
 *
 * This lab demonstrates how Suspense enables streaming.
 * The page shell renders immediately, slow data streams in later.
 *
 * Key characteristics:
 * - Suspense boundaries show fallback immediately
 * - When async component resolves, it streams into the page
 * - User sees something instantly, even if data is slow
 *
 * When to use:
 * - Pages with mixed fast/slow data
 * - E-commerce: show product info fast, reviews later
 * - Dashboards: show layout, stream in widgets
 */

// Force dynamic to demonstrate streaming clearly
export const dynamic = "force-dynamic";

// ========================================
// SLOW COMPONENTS (wrapped in Suspense)
// ========================================

async function SlowProducts() {
  // Simulate slow database query (1.5 seconds!)
  const products = await getAllProducts(1500);
  const fetchedAt = getTimestamp();

  return (
    <div>
      <p className="text-xs text-emerald-400 mb-3">
        ✓ Streamed in after 1.5 seconds
      </p>
      <ProductList products={products} variant="list" />
    </div>
  );
}

async function SlowReviews() {
  // Even slower - 2 seconds
  const reviews = await getReviewsForProduct("prod_001", 2000);
  const fetchedAt = getTimestamp();

  return (
    <div className="space-y-3">
      <p className="text-xs text-emerald-400 mb-3">
        ✓ Streamed in after 2 seconds
      </p>
      {reviews.map((review) => (
        <div key={review.id} className="p-3 rounded-lg bg-zinc-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-zinc-200">{review.userName}</span>
            <span className="text-amber-400">{"★".repeat(review.rating)}</span>
          </div>
          <p className="text-sm text-zinc-400">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

// ========================================
// FAST COMPONENT (renders immediately)
// ========================================

async function FastHeader() {
  // Fast data - only 100ms
  const featured = await getFeaturedProducts(1, 100);
  const product = featured[0];

  return (
    <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20">
      <p className="text-xs text-cyan-400 mb-2">
        ✓ Rendered immediately (100ms)
      </p>
      <h3 className="font-semibold text-zinc-100">{product?.name}</h3>
      <p className="text-sm text-zinc-400">{product?.description}</p>
      <p className="text-lg font-bold text-cyan-400 mt-2">${product?.price}</p>
    </div>
  );
}

export default async function SuspenseStreamingPage() {
  const timer = createTimer();
  const pageLoadTime = getTimestamp();

  return (
    <LabShell
      title="Suspense Streaming"
      description="Shell renders immediately while slow data streams in progressively."
      concept="By wrapping slow components in <Suspense>, the shell HTML ships immediately. Users see loading skeletons, then real content streams in as it becomes available. This dramatically improves perceived performance."
      codeExample={`// The magic: Suspense boundaries enable streaming
<Suspense fallback={<ProductSkeleton />}>
  {/* This component can be async! */}
  <SlowProducts />
</Suspense>

// The async component fetches its own data
async function SlowProducts() {
  const products = await getProducts(); // Takes 1.5s
  return <ProductList products={products} />;
}

// What happens:
// 1. Shell HTML sent immediately
// 2. Skeleton shown in browser
// 3. When data ready, React streams the real content
// 4. Browser swaps skeleton for content (no flash!)`}
      tips={[
        "Watch how the skeletons appear instantly, then content streams in",
        "Open Network tab - you'll see a streaming HTML response",
        "Note the different load times for each section",
      ]}
      warnings={[
        "Don't overuse Suspense - too many boundaries can feel jarring",
        "Group related data in the same Suspense boundary",
        "Skeleton should match the shape of real content",
      ]}
    >
      {/* Page Header (renders immediately) */}
      <div className="mb-6 p-4 rounded-xl bg-zinc-800/50">
        <p className="text-sm text-zinc-400">
          Page shell rendered at:{" "}
          <span className="text-zinc-200">
            {new Date(pageLoadTime).toLocaleTimeString()}
          </span>
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          The content below will stream in progressively...
        </p>
      </div>

      {/* Fast Content */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Featured Product (Fast - 100ms)
        </h2>
        <Suspense
          fallback={
            <div className="h-32 rounded-xl bg-zinc-800 animate-pulse" />
          }
        >
          <FastHeader />
        </Suspense>
      </div>

      {/* Grid of Suspense Boundaries */}
      <div className="grid grid-cols-2 gap-6">
        {/* Slow Products */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">
            All Products (Slow - 1.5s)
          </h2>
          <Suspense fallback={<ProductGridSkeleton count={4} />}>
            <SlowProducts />
          </Suspense>
        </div>

        {/* Even Slower Reviews */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">
            Reviews (Very Slow - 2s)
          </h2>
          <Suspense
            fallback={
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 rounded-lg bg-zinc-800 animate-pulse"
                  />
                ))}
              </div>
            }
          >
            <SlowReviews />
          </Suspense>
        </div>
      </div>

      {/* Streaming Explanation */}
      <div className="mt-8 p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
        <h3 className="font-semibold text-cyan-400 mb-2">
          How Streaming Works
        </h3>
        <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
          <li>Server sends the HTML shell with Suspense fallbacks</li>
          <li>Browser renders the shell immediately (fast TTFB!)</li>
          <li>Server continues processing slow components</li>
          <li>As each component finishes, HTML streams to the browser</li>
          <li>React swaps fallback for real content (no page reload)</li>
        </ol>
      </div>
    </LabShell>
  );
}
