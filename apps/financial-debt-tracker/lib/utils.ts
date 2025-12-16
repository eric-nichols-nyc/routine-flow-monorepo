/**
 * Formats a duration in seconds to a human-readable string.
 * @param seconds - The duration in seconds
 * @returns A formatted string like "5m" or "30s"
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) {
    return `${seconds}s`;
  }
  return `${minutes}m`;
}

/**
 * Formats a duration in seconds to a time string in MM:SS format.
 * @param seconds - The duration in seconds
 * @returns A formatted string like "05:30" or "00:45"
 */
export function formatTime(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(clamped / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (clamped % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

