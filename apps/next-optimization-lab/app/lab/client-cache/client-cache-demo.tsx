"use client";

import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { Product } from "@/lib/types";

/**
 * CLIENT-SIDE CACHING DEMO
 *
 * This demonstrates the SWR (stale-while-revalidate) pattern:
 * 1. Show cached data immediately
 * 2. Fetch fresh data in background
 * 3. Update UI when fresh data arrives
 *
 * We're implementing a simplified version without SWR library
 * to show the underlying concepts.
 */

// Simple in-memory cache (in real app, use SWR or React Query)
const cache: Map<string, { data: Product[]; timestamp: number }> = new Map();
const STALE_TIME = 10000; // 10 seconds

function useSWRLike(url: string) {
  const [data, setData] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchData = useCallback(
    async (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      setIsValidating(true);
      setError(null);

      try {
        // Check cache first
        const cached = cache.get(url);
        const now = Date.now();

        if (cached) {
          // Serve stale data immediately
          setData(cached.data);
          setIsLoading(false);

          // If not stale, skip refetch
          if (now - cached.timestamp < STALE_TIME) {
            setIsValidating(false);
            return;
          }
        }

        // Fetch fresh data (with artificial delay for demo)
        await new Promise((r) => setTimeout(r, 800));
        const res = await fetch(url);

        if (!res.ok) throw new Error("Failed to fetch");

        const freshData = await res.json();

        // Update cache
        cache.set(url, { data: freshData, timestamp: now });

        setData(freshData);
        setLastFetched(new Date());
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
        setIsValidating(false);
      }
    },
    [url],
  );

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Revalidate on focus (like SWR's revalidateOnFocus)
  useEffect(() => {
    const handleFocus = () => {
      fetchData(false); // Don't show loading spinner on focus revalidation
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchData]);

  return {
    data,
    isLoading,
    isValidating,
    error,
    lastFetched,
    mutate: () => fetchData(false),
  };
}

export function ClientCacheDemo() {
  const { data, isLoading, isValidating, error, lastFetched, mutate } =
    useSWRLike("/api/products?delay=300");
  const [optimisticItem, setOptimisticItem] = useState<string | null>(null);

  // Demo optimistic update
  const handleOptimisticAdd = () => {
    const itemName = `Optimistic Item ${Date.now()}`;
    setOptimisticItem(itemName);

    // Simulate server delay then clear optimistic state
    setTimeout(() => {
      setOptimisticItem(null);
      mutate(); // Revalidate to get server state
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="p-4 rounded-xl bg-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Loading State */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-sm text-blue-400">Loading...</span>
              </>
            ) : isValidating ? (
              <>
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="text-sm text-amber-400">Revalidating...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400">Fresh</span>
              </>
            )}
          </div>

          {/* Last Fetched */}
          {lastFetched && (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Clock className="w-4 h-4" />
              Last fetched: {lastFetched.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Manual Refresh */}
        <button
          onClick={() => mutate()}
          disabled={isValidating}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-700 text-zinc-200 hover:bg-zinc-600 disabled:opacity-50 transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 ${isValidating ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error.message}</p>
        </div>
      )}

      {/* Products Grid */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Optimistic Item (if adding) */}
          {optimisticItem && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 animate-pulse">
              <p className="text-sm text-emerald-400 mb-2">Adding...</p>
              <p className="font-medium text-zinc-200">{optimisticItem}</p>
              <p className="text-xs text-zinc-500 mt-1">Saving to server...</p>
            </div>
          )}

          {/* Real Products */}
          {data.map((product) => (
            <div
              key={product.id}
              className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700"
            >
              <p className="font-medium text-zinc-200 mb-1">{product.name}</p>
              <p className="text-sm text-zinc-500 line-clamp-2">
                {product.description}
              </p>
              <p className="text-lg font-bold text-indigo-400 mt-2">
                ${product.price}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Optimistic Update Demo */}
      <div className="p-5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
        <h3 className="font-semibold text-indigo-400 mb-3">
          Optimistic Update Demo
        </h3>
        <p className="text-sm text-zinc-400 mb-4">
          Click to add an item. It appears instantly (optimistic), then confirms
          with the server.
        </p>
        <button
          onClick={handleOptimisticAdd}
          disabled={!!optimisticItem}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 disabled:opacity-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {optimisticItem ? "Adding..." : "Add Item (Optimistic)"}
        </button>
      </div>

      {/* SWR Behavior Explanation */}
      <div className="p-5 rounded-xl bg-zinc-800/50 border border-zinc-700">
        <h3 className="font-semibold text-zinc-200 mb-3">
          Try These SWR Behaviors
        </h3>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-indigo-400">1.</span>
            <span>
              <strong>Focus Revalidation:</strong> Click away from this tab,
              wait a moment, then click back. Data revalidates in background.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400">2.</span>
            <span>
              <strong>Deduplication:</strong> Click Refresh multiple times
              quickly. Only one request is made.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400">3.</span>
            <span>
              <strong>Stale Data:</strong> Refresh shows data instantly (stale),
              then updates when fresh data arrives.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
