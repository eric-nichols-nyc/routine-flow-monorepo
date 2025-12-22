import "server-only";
import { getTimestamp } from "./timing";
import type { Product } from "./types";

/**
 * Product Fetching with Different Caching Strategies
 *
 * This file demonstrates Next.js extended fetch options.
 * Each function uses a different caching strategy.
 *
 * IMPORTANT: These would normally hit a real API.
 * For demo purposes, we're using a local API route.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";

/**
 * NO-STORE: Always fresh, never cached
 *
 * Use for:
 * - Real-time data (stock prices, live scores)
 * - User-specific data that can't be shared
 * - When stale data is unacceptable
 *
 * Downside: Slowest option, full round-trip every request
 */
export async function fetchProductsNoStore(): Promise<{
  products: Product[];
  fetchedAt: string;
}> {
  const res = await fetch(`${API_BASE}/api/products`, {
    cache: "no-store", // Opt out of caching entirely
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  const products = await res.json();
  return {
    products,
    fetchedAt: getTimestamp(),
  };
}

/**
 * FORCE-CACHE: Cache indefinitely until redeployed
 *
 * Use for:
 * - Truly static content
 * - Reference data that rarely changes
 * - Build-time data
 *
 * Note: This is the default for fetch in Next.js
 */
export async function fetchProductsForceCache(): Promise<{
  products: Product[];
  fetchedAt: string;
}> {
  const res = await fetch(`${API_BASE}/api/products`, {
    cache: "force-cache", // Cache forever (default)
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  const products = await res.json();
  return {
    products,
    fetchedAt: getTimestamp(),
  };
}

/**
 * REVALIDATE (Time-Based): Stale-while-revalidate pattern
 *
 * Use for:
 * - Data that changes occasionally (product catalog, blog posts)
 * - When slight staleness is acceptable
 * - Balance between freshness and performance
 *
 * How it works:
 * 1. First request: fetch and cache
 * 2. Within revalidate window: serve from cache
 * 3. After window: serve stale, revalidate in background
 */
export async function fetchProductsRevalidate(
  seconds: number = 60,
): Promise<{ products: Product[]; fetchedAt: string }> {
  const res = await fetch(`${API_BASE}/api/products`, {
    next: { revalidate: seconds }, // Revalidate every N seconds
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  const products = await res.json();
  return {
    products,
    fetchedAt: getTimestamp(),
  };
}

/**
 * TAGS: On-demand revalidation
 *
 * Use for:
 * - Data that changes on user action (after mutation)
 * - Precise cache invalidation
 * - E-commerce carts, inventory updates
 *
 * Pair with: revalidateTag('products') in Server Actions
 */
export async function fetchProductsWithTags(): Promise<{
  products: Product[];
  fetchedAt: string;
}> {
  const res = await fetch(`${API_BASE}/api/products`, {
    next: {
      tags: ["products", "catalog"], // Multiple tags supported
    },
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  const products = await res.json();
  return {
    products,
    fetchedAt: getTimestamp(),
  };
}

/**
 * Fetch a single product with tag
 * Demonstrates per-item cache invalidation
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    next: {
      tags: [`product-${id}`, "products"], // Tag by ID + general products tag
    },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch product");
  }

  return res.json();
}
