"use client";

import { useState, lazy, Suspense } from "react";
import { RenderTracker } from "@/components/render-tracker";
import { Loader2, BarChart3, PieChart, LineChart } from "lucide-react";

// Simulate lazy-loaded components with artificial delay
const LazyBarChart = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>((resolve) =>
      setTimeout(
        () =>
          resolve({
            default: function BarChartComponent() {
              return (
                <RenderTracker name="BarChart (Lazy Loaded)" color="emerald">
                  <div className="space-y-2">
                    <div className="flex items-end gap-2 h-32">
                      {[65, 80, 45, 90, 70, 55, 85].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500 text-center">
                      Chart loaded after 1.5s delay
                    </p>
                  </div>
                </RenderTracker>
              );
            },
          }),
        1500,
      ),
    ),
);

const LazyPieChart = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>((resolve) =>
      setTimeout(
        () =>
          resolve({
            default: function PieChartComponent() {
              return (
                <RenderTracker name="PieChart (Lazy Loaded)" color="violet">
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="rgb(139 92 246 / 0.3)"
                          strokeWidth="20"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="rgb(139 92 246)"
                          strokeWidth="20"
                          strokeDasharray="150 251"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-violet-400">
                          60%
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 text-center mt-2">
                    Chart loaded after 2s delay
                  </p>
                </RenderTracker>
              );
            },
          }),
        2000,
      ),
    ),
);

const LazyLineChart = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>((resolve) =>
      setTimeout(
        () =>
          resolve({
            default: function LineChartComponent() {
              return (
                <RenderTracker name="LineChart (Lazy Loaded)" color="cyan">
                  <div className="h-32 flex items-end">
                    <svg viewBox="0 0 200 100" className="w-full h-full">
                      <polyline
                        fill="none"
                        stroke="rgb(34 211 238)"
                        strokeWidth="3"
                        points="0,80 30,60 60,70 90,30 120,50 150,20 180,40 200,10"
                      />
                      <polyline
                        fill="url(#gradient)"
                        stroke="none"
                        points="0,100 0,80 30,60 60,70 90,30 120,50 150,20 180,40 200,10 200,100"
                      />
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="rgb(34 211 238 / 0.3)" />
                          <stop offset="100%" stopColor="rgb(34 211 238 / 0)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <p className="text-xs text-zinc-500 text-center">
                    Chart loaded after 1s delay
                  </p>
                </RenderTracker>
              );
            },
          }),
        1000,
      ),
    ),
);

function LoadingFallback({ name }: { name: string }) {
  return (
    <div className="p-4 rounded-xl border border-zinc-700 bg-zinc-800/50 animate-pulse">
      <div className="flex items-center justify-center gap-2 h-32">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
        <span className="text-zinc-500 text-sm">Loading {name}...</span>
      </div>
    </div>
  );
}

export function LazyLoadingDemo() {
  const [showBar, setShowBar] = useState(false);
  const [showPie, setShowPie] = useState(false);
  const [showLine, setShowLine] = useState(false);

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      {/* Controls */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowBar(!showBar)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
            showBar
              ? "bg-emerald-500 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Bar Chart
        </button>
        <button
          onClick={() => setShowPie(!showPie)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
            showPie
              ? "bg-violet-500 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <PieChart className="w-4 h-4" />
          Pie Chart
        </button>
        <button
          onClick={() => setShowLine(!showLine)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
            showLine
              ? "bg-cyan-500 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <LineChart className="w-4 h-4" />
          Line Chart
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-3 gap-4">
        {showBar && (
          <Suspense fallback={<LoadingFallback name="Bar Chart" />}>
            <LazyBarChart />
          </Suspense>
        )}
        {showPie && (
          <Suspense fallback={<LoadingFallback name="Pie Chart" />}>
            <LazyPieChart />
          </Suspense>
        )}
        {showLine && (
          <Suspense fallback={<LoadingFallback name="Line Chart" />}>
            <LazyLineChart />
          </Suspense>
        )}
      </div>

      {!showBar && !showPie && !showLine && (
        <div className="text-center py-8 text-zinc-500">
          Click buttons above to lazy load chart components
        </div>
      )}

      <div className="mt-4 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
        <p className="text-sm text-indigo-400">
          <strong>What's happening:</strong>
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          Each chart is wrapped in React.lazy() with a simulated network delay.
          The component code is only "downloaded" when you click the button.
          Suspense shows a loading fallback until the component is ready.
        </p>
      </div>
    </div>
  );
}
