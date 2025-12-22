import "server-only";
import { cache } from "react";
import {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getReviewsForProduct,
} from "./db";
import type { Product, Review } from "./types";

/**
 * React cache() for Request-Level Deduplication
 *
 * CRITICAL CONCEPT:
 * React's cache() function deduplicates function calls within a SINGLE request.
 * If multiple components call the same cached function during one render,
 * the actual function only executes ONCE.
 *
 * This is different from Next.js fetch caching (which persists across requests).
 *
 * Use cases:
 * - Multiple components need the same data
 * - Avoid prop drilling by letting each component fetch
 * - Works with any async function, not just fetch
 */

/**
 * Cached version of getAllProducts
 *
 * If ProductList, ProductGrid, and ProductCount all call this
 * in the same request, the DB query runs only ONCE.
 */
export const getCachedProducts = cache(async (): Promise<Product[]> => {
  console.log(
    "[cache.ts] getCachedProducts called - this log should appear once per request",
  );
  return getAllProducts();
});

/**
 * Cached version of getProductById
 *
 * Since this takes an ID parameter, cache() will dedupe
 * calls with the SAME id within the same request.
 */
export const getCachedProductById = cache(
  async (id: string): Promise<Product | null> => {
    console.log(`[cache.ts] getCachedProductById(${id}) called`);
    return getProductById(id);
  },
);

/**
 * Cached version of getFeaturedProducts
 */
export const getCachedFeaturedProducts = cache(
  async (limit: number = 3): Promise<Product[]> => {
    console.log(`[cache.ts] getCachedFeaturedProducts(${limit}) called`);
    return getFeaturedProducts(limit);
  },
);

/**
 * Cached version of getReviewsForProduct
 */
export const getCachedReviews = cache(
  async (productId: string): Promise<Review[]> => {
    console.log(`[cache.ts] getCachedReviews(${productId}) called`);
    return getReviewsForProduct(productId);
  },
);

/**
 * Example of cache() with computed data
 *
 * You can cache any computation, not just DB calls.
 * This is useful for expensive transformations.
 */
export const getCachedProductStats = cache(async () => {
  console.log("[cache.ts] getCachedProductStats called");
  const products = await getCachedProducts(); // This will also be deduped!

  return {
    totalProducts: products.length,
    inStockCount: products.filter((p) => p.inStock).length,
    averagePrice:
      products.reduce((sum, p) => sum + p.price, 0) / products.length,
    averageRating:
      products.reduce((sum, p) => sum + p.rating, 0) / products.length,
  };
});
