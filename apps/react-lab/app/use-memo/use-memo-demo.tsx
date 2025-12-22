"use client";

import { useState, useMemo, useRef } from "react";
import { RenderTracker } from "@/components/render-tracker";
import { Clock } from "lucide-react";

// Simulated expensive calculation
function expensiveCalculation(num: number): number {
  const start = performance.now();
  // Simulate heavy work
  let result = 0;
  for (let i = 0; i < num * 1000000; i++) {
    result += Math.sqrt(i);
  }
  const end = performance.now();
  console.log(`Calculation took ${(end - start).toFixed(2)}ms`);
  return Math.floor(result);
}

export function UseMemoDemo() {
  const [number, setNumber] = useState(5);
  const [darkMode, setDarkMode] = useState(false);
  const calculationCount = useRef(0);

  // WITH useMemo: Only recalculates when 'number' changes
  const memoizedResult = useMemo(() => {
    calculationCount.current += 1;
    return expensiveCalculation(number);
  }, [number]);

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <div className="grid grid-cols-2 gap-6">
        <RenderTracker name="Controls (triggers re-render)" color="blue">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">
                Number (1-20)
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-blue-400 mt-1">Value: {number}</p>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-full py-2 px-4 rounded-lg text-sm transition-colors ${
                darkMode
                  ? "bg-zinc-700 text-zinc-100"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              Toggle Dark Mode: {darkMode ? "ON" : "OFF"}
            </button>
            <p className="text-xs text-zinc-600">
              ↑ This toggle causes a re-render but NOT a recalculation!
            </p>
          </div>
        </RenderTracker>

        <RenderTracker name="Memoized Calculation" color="amber">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-zinc-500">Expensive Result</span>
          </div>
          <p className="text-3xl font-bold text-amber-400 font-mono">
            {memoizedResult.toLocaleString()}
          </p>
          <p className="text-xs text-zinc-500 mt-2">
            Calculations run:{" "}
            <span className="text-amber-400">{calculationCount.current}</span>
          </p>
        </RenderTracker>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <p className="text-sm text-emerald-400">
          <strong>With useMemo:</strong>
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          Changing the number triggers recalculation. Toggling dark mode
          re-renders but skips the expensive calculation because the dependency
          (number) didn't change.
        </p>
      </div>
    </div>
  );
}
