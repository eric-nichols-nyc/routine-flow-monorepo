import { revalidateTag } from "next/cache";
import { LabShell } from "@/components/lab-shell";
import { MetricsPanel } from "@/components/metrics-panel";
import { ProductList } from "@/components/product-list";
import { getTimestamp, createTimer } from "@/lib/timing";
import type { Product } from "@/lib/types";

/**
 * TAGS INVALIDATION - On-Demand Cache Invalidation
 *
 * This lab demonstrates cache tags and revalidateTag().
 * Data is cached indefinitely until you explicitly invalidate it.
 *
 * Key characteristics:
 * - next: { tags: ['products'] } tags the cached data
 * - revalidateTag('products') invalidates all data with that tag
 * - Perfect for mutations: add product → invalidate product cache
 *
 * When to use in production:
 * - After user mutations (add to cart, update profile)
 * - When webhooks notify you of external changes
 * - CMS content updates
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";

async function getProducts(): Promise<{
  products: Product[];
  fetchedAt: string;
}> {
  const res = await fetch(`${API_URL}/api/products?delay=500`, {
    // Tag this fetch so we can invalidate it later
    next: { tags: ["products", "catalog"] },
  });

  if (!res.ok) throw new Error("Failed to fetch");

  const products = await res.json();
  return {
    products,
    fetchedAt: getTimestamp(),
  };
}

// Server Action to invalidate the cache
async function invalidateProducts() {
  "use server";

  // This invalidates ALL cached requests tagged with 'products'
  // Could be from multiple components, different pages, etc.
  // Note: Next.js 16 requires a cache profile as the second argument
  revalidateTag("products", "default");

  console.log(
    "[Server Action] revalidateTag('products') called at",
    new Date().toISOString(),
  );
}

export default async function TagsInvalidationPage() {
  const timer = createTimer();

  const { products, fetchedAt } = await getProducts();

  const renderTimeMs = timer.elapsed();

  return (
    <LabShell
      title="Tags & Invalidation"
      description="Cache indefinitely until explicitly invalidated with revalidateTag()."
      concept="Tag your fetches with descriptive names. When data changes (via Server Action, webhook, etc.), call revalidateTag() to invalidate all cached data with that tag. This gives you fine-grained control over cache invalidation."
      codeExample={`// 1. Tag your fetch
const res = await fetch(url, {
  next: { tags: ['products', 'catalog'] }
});

// 2. Create a Server Action for mutations
async function addProduct(data: FormData) {
  'use server';

  await db.products.create({ ... });

  // Invalidate ALL fetches tagged 'products'
  revalidateTag('products');
}

// 3. Call from client
<form action={addProduct}>
  <button type="submit">Add Product</button>
</form>`}
      tips={[
        "Click 'Invalidate Cache' then refresh to see new timestamp",
        "You can tag with multiple tags for granular control",
        "revalidateTag works across all routes that use that tag",
      ]}
      warnings={[
        "Tags are global - be careful with naming collisions",
        "revalidatePath('/'...') invalidates by route, not by tag",
        "In dev mode, caching behaves differently than production",
      ]}
    >
      {/* Metrics Panel */}
      <MetricsPanel
        metrics={{
          fetchCount: 1,
          renderTimeMs,
          cacheMode: "tags",
          lastUpdated: fetchedAt,
          notes:
            "Data is cached until you invalidate it. Click the button below to trigger revalidateTag().",
        }}
      />

      {/* Invalidation Control */}
      <div className="mt-6 p-5 rounded-xl bg-violet-500/10 border border-violet-500/20">
        <h3 className="font-semibold text-violet-400 mb-3">Cache Control</h3>
        <div className="flex items-center gap-4">
          <form action={invalidateProducts}>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-violet-500 text-white font-medium hover:bg-violet-600 transition-colors"
            >
              Invalidate Cache
            </button>
          </form>
          <p className="text-sm text-zinc-400">
            Then refresh the page to see the new timestamp
          </p>
        </div>
        <p className="text-xs text-zinc-500 mt-3">
          Current cache tags: <code className="text-violet-400">products</code>,{" "}
          <code className="text-violet-400">catalog</code>
        </p>
      </div>

      {/* Product Grid */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Tagged Products (Cached at {new Date(fetchedAt).toLocaleTimeString()})
        </h2>
        <ProductList products={products} />
      </div>
    </LabShell>
  );
}
