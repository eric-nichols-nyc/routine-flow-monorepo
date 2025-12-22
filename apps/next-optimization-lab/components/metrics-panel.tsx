import { Activity, Clock, Database, RefreshCw, Tag } from "lucide-react";
import type { FetchMetrics } from "@/lib/types";
import { getRelativeTime } from "@/lib/timing";

interface MetricsPanelProps {
  metrics: FetchMetrics;
  className?: string;
}

/**
 * MetricsPanel - Displays performance metrics for each lab
 *
 * Shows:
 * - Number of fetches made
 * - Server render time
 * - Cache mode used
 * - Last updated timestamp
 * - Optional notes
 */
export function MetricsPanel({ metrics, className = "" }: MetricsPanelProps) {
  const cacheColorMap: Record<FetchMetrics["cacheMode"], string> = {
    "no-store": "text-red-400 bg-red-500/10 border-red-500/30",
    "force-cache": "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    revalidate: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    tags: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    cached: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    deduped: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  };

  const cacheLabelMap: Record<FetchMetrics["cacheMode"], string> = {
    "no-store": "No Cache",
    "force-cache": "Force Cache",
    revalidate: "Revalidate",
    tags: "Tagged",
    cached: "Cached",
    deduped: "Deduped",
  };

  return (
    <div
      className={`p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-zinc-400" />
        <h3 className="font-semibold text-zinc-200">Request Metrics</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Fetch Count */}
        <div className="p-3 rounded-xl bg-zinc-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-500">Fetches</span>
          </div>
          <p className="text-2xl font-bold text-zinc-100">
            {metrics.fetchCount}
          </p>
        </div>

        {/* Render Time */}
        <div className="p-3 rounded-xl bg-zinc-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-500">Render Time</span>
          </div>
          <p className="text-2xl font-bold text-zinc-100">
            {metrics.renderTimeMs}ms
          </p>
        </div>

        {/* Cache Mode */}
        <div className="p-3 rounded-xl bg-zinc-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-500">Cache Mode</span>
          </div>
          <span
            className={`inline-flex px-2 py-1 rounded-lg text-sm font-medium border ${cacheColorMap[metrics.cacheMode]}`}
          >
            {cacheLabelMap[metrics.cacheMode]}
          </span>
        </div>

        {/* Last Updated */}
        <div className="p-3 rounded-xl bg-zinc-800/50">
          <div className="flex items-center gap-2 mb-1">
            <RefreshCw className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-500">Updated</span>
          </div>
          <p className="text-sm font-medium text-zinc-100">
            {getRelativeTime(metrics.lastUpdated)}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {new Date(metrics.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Notes */}
      {metrics.notes && (
        <div className="mt-4 p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
          <p className="text-sm text-zinc-400">{metrics.notes}</p>
        </div>
      )}
    </div>
  );
}
