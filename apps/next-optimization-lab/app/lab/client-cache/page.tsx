import { LabShell } from "@/components/lab-shell";
import { ClientCacheDemo } from "./client-cache-demo";

/**
 * CLIENT CACHE - SWR / React Query
 *
 * This lab demonstrates client-side caching with stale-while-revalidate.
 * Data is cached in the browser and revalidated in the background.
 *
 * Key characteristics:
 * - Data persists across navigations
 * - Background revalidation keeps data fresh
 * - Optimistic updates for instant UI feedback
 *
 * When to use:
 * - Highly interactive features
 * - Data that updates frequently
 * - When you need optimistic updates
 * - Real-time collaboration features
 */
export default function ClientCachePage() {
  return (
    <LabShell
      title="Client Cache (SWR Pattern)"
      description="Stale-while-revalidate caching on the client for interactive features."
      concept="While Server Components are great for initial load, some features benefit from client-side caching. Libraries like SWR and TanStack Query cache data in the browser, serve stale data instantly, then revalidate in the background. This enables features like optimistic updates and real-time sync."
      codeExample={`// Using SWR for client-side data
'use client';

import useSWR from 'swr';

function ProductList() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/products',
    fetcher,
    {
      revalidateOnFocus: true,     // Refetch when tab focused
      revalidateOnReconnect: true,  // Refetch on network restore
      dedupingInterval: 2000,       // Dedupe requests within 2s
    }
  );

  // Optimistic update example
  async function addProduct(newProduct) {
    // Update UI immediately (optimistic)
    mutate([...data, newProduct], false);

    // Then send to server
    await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(newProduct)
    });

    // Revalidate to get actual server state
    mutate();
  }

  return <ul>...</ul>;
}`}
      tips={[
        "Click between tabs - notice data persists without refetching",
        "Focus away and back - SWR revalidates in background",
        "Try the optimistic update demo - UI updates instantly",
      ]}
      warnings={[
        "Client cache means sending JavaScript to the browser",
        "For most read-heavy pages, Server Components are more efficient",
        "Use client cache for interactive features, not static content",
      ]}
    >
      <ClientCacheDemo />
    </LabShell>
  );
}
