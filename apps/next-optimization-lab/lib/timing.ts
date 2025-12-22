/**
 * Timing utilities for demonstrating performance characteristics
 *
 * These helpers add artificial delays to simulate real-world latency
 * and help visualize the impact of different caching strategies.
 */

/**
 * Simulates database latency
 * In production, this would be actual DB query time
 */
export async function simulateDbLatency(ms: number = 500): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simulates slow network for external API calls
 */
export async function simulateNetworkLatency(ms: number = 1000): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns a formatted timestamp string
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Returns a human-readable relative time
 */
export function getRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);

  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
  if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
  return `${Math.floor(diffSecs / 86400)}d ago`;
}

/**
 * High-resolution timer for measuring render times
 */
export function createTimer() {
  const start = performance.now();
  return {
    elapsed: () => Math.round(performance.now() - start),
    elapsedFormatted: () => `${Math.round(performance.now() - start)}ms`,
  };
}

/**
 * Wraps an async function to measure its execution time
 */
export async function measureAsync<T>(
  fn: () => Promise<T>,
): Promise<{ result: T; durationMs: number }> {
  const start = performance.now();
  const result = await fn();
  const durationMs = Math.round(performance.now() - start);
  return { result, durationMs };
}

/**
 * Global fetch counter for metrics display
 * In a real app, you'd use proper observability tools
 */
let fetchCount = 0;

export function incrementFetchCount(): number {
  return ++fetchCount;
}

export function getFetchCount(): number {
  return fetchCount;
}

export function resetFetchCount(): void {
  fetchCount = 0;
}
