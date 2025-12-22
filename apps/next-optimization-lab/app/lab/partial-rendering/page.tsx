import { Suspense } from "react";
import { LabShell } from "@/components/lab-shell";
import { MetricsPanel } from "@/components/metrics-panel";
import { ProductList } from "@/components/product-list";
import {
  ProductGridSkeleton,
  ProductListSkeleton,
} from "@/components/skeleton";
import {
  getFeaturedProducts,
  getAllProducts,
  getReviewsForProduct,
} from "@/lib/db";
import { getTimestamp, createTimer } from "@/lib/timing";
import { ArrowDown, Clock, Zap } from "lucide-react";

/**
 * PARTIAL RENDERING - Above-the-fold First
 *
 * This lab demonstrates prioritizing critical content.
 * What users see first loads fast, less important content streams later.
 *
 * Key characteristics:
 * - Critical "above the fold" content has no Suspense (fast)
 * - Non-critical content wrapped in Suspense (can be slow)
 * - Improves Core Web Vitals (LCP, FID)
 *
 * When to use:
 * - E-commerce PDPs: product info fast, reviews later
 * - Dashboards: key metrics fast, charts later
 * - Any page with a clear content hierarchy
 */

// Force dynamic for demo purposes
export const dynamic = "force-dynamic";

// ========================================
// ABOVE THE FOLD - No Suspense, loads fast
// ========================================
async function HeroProduct() {
  // Fast fetch - 100ms
  const featured = await getFeaturedProducts(1, 100);
  const product = featured[0];

  if (!product) {
    return <div className="text-zinc-400">No featured product available</div>;
  }

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-violet-500/10 border border-pink-500/20">
      <div className="flex items-center gap-2 text-pink-400 text-sm mb-4">
        <Zap className="w-4 h-4" />
        Above the Fold (100ms)
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="aspect-square rounded-xl bg-zinc-800 flex items-center justify-center">
          <span className="text-zinc-600">Product Image</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">
            {product.name}
          </h2>
          <p className="text-zinc-400 mb-4">{product.description}</p>
          <p className="text-3xl font-bold text-pink-400 mb-6">
            ${product.price}
          </p>
          <button className="w-full py-3 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================
// BELOW THE FOLD - Wrapped in Suspense, can be slow
// ========================================
async function RelatedProducts() {
  // Slower fetch - 800ms
  const products = await getAllProducts(800);

  return (
    <div>
      <div className="flex items-center gap-2 text-emerald-400 text-sm mb-4">
        <Clock className="w-4 h-4" />
        Streamed in (800ms)
      </div>
      <ProductList products={products.slice(0, 3)} />
    </div>
  );
}

async function ProductReviews() {
  // Slowest fetch - 1200ms
  const reviews = await getReviewsForProduct("prod_001", 1200);

  return (
    <div>
      <div className="flex items-center gap-2 text-blue-400 text-sm mb-4">
        <Clock className="w-4 h-4" />
        Streamed in (1200ms)
      </div>
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 rounded-xl bg-zinc-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-zinc-200">
                {review.userName}
              </span>
              <span className="text-amber-400">
                {"★".repeat(review.rating)}
              </span>
            </div>
            <p className="text-sm text-zinc-400">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function PartialRenderingPage() {
  const timer = createTimer();
  const fetchedAt = getTimestamp();

  return (
    <LabShell
      title="Partial Rendering"
      description="Prioritize above-the-fold content. Critical data loads fast, the rest streams in."
      concept="Not all content is equally important. By strategically placing Suspense boundaries, you can ensure users see the most important content immediately (hero, CTA, product info) while less critical content (reviews, related items) loads in the background."
      codeExample={`// Above the fold - NO Suspense, must be fast
async function HeroProduct() {
  const product = await getProduct(id, { delay: 100 }); // Fast!
  return <ProductHero product={product} />;
}

// Below the fold - Suspense OK, can be slow
async function Reviews() {
  const reviews = await getReviews(id); // Can be slow
  return <ReviewList reviews={reviews} />;
}

// Page composition
export default function ProductPage() {
  return (
    <>
      {/* Critical - no Suspense */}
      <HeroProduct />

      {/* Non-critical - wrapped in Suspense */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews />
      </Suspense>
    </>
  );
}`}
      tips={[
        "Notice how the hero section appears instantly",
        "Related products and reviews stream in afterwards",
        "This improves LCP (Largest Contentful Paint)",
      ]}
      warnings={[
        "Be careful what you consider 'critical' - users expect CTAs to work immediately",
        "Don't lazy-load navigation or main content",
        "Consider the fold line on mobile vs desktop",
      ]}
    >
      {/* Metrics */}
      <MetricsPanel
        metrics={{
          fetchCount: 3,
          renderTimeMs: timer.elapsed(),
          cacheMode: "no-store",
          lastUpdated: fetchedAt,
          notes: "Hero: ~100ms (instant) | Related: ~800ms | Reviews: ~1200ms",
        }}
      />

      {/* Above the Fold - Critical Content */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-pink-500/50 to-transparent" />
          <span className="text-xs text-pink-400 uppercase tracking-wider">
            Above the Fold
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-pink-500/50 to-transparent" />
        </div>
        <HeroProduct />
      </div>

      {/* Fold Indicator */}
      <div className="my-8 flex items-center gap-4 text-zinc-500">
        <div className="h-px flex-1 bg-zinc-800 border-t border-dashed border-zinc-700" />
        <div className="flex items-center gap-2 text-sm">
          <ArrowDown className="w-4 h-4" />
          Scroll / Below the Fold
        </div>
        <div className="h-px flex-1 bg-zinc-800 border-t border-dashed border-zinc-700" />
      </div>

      {/* Below the Fold - Non-Critical Content */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">
            Related Products
          </h3>
          <Suspense fallback={<ProductListSkeleton count={3} />}>
            <RelatedProducts />
          </Suspense>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">
            Customer Reviews
          </h3>
          <Suspense
            fallback={
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl bg-zinc-800 animate-pulse"
                  />
                ))}
              </div>
            }
          >
            <ProductReviews />
          </Suspense>
        </div>
      </div>
    </LabShell>
  );
}
