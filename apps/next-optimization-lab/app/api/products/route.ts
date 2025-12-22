import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/db";
import { simulateNetworkLatency } from "@/lib/timing";

/**
 * GET /api/products
 *
 * Returns all products with simulated network latency.
 * This API is used by labs to demonstrate different caching strategies.
 *
 * Query params:
 * - delay: Custom delay in ms (default: 500)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const delay = parseInt(searchParams.get("delay") || "500", 10);

  // Simulate network latency
  await simulateNetworkLatency(delay);

  const products = await getAllProducts(0); // 0 delay since we already simulated

  return NextResponse.json(products, {
    headers: {
      // Add timestamp header so clients can see when data was fetched
      "X-Fetch-Time": new Date().toISOString(),
    },
  });
}
