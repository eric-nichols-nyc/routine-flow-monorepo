"use client";

import { useState, useRef } from "react";
import { RenderTracker } from "@/components/render-tracker";
import { Zap } from "lucide-react";

export function BatchingDemo() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const renderCount = useRef(0);
  renderCount.current += 1;

  const handleMultipleUpdates = () => {
    // React 18+ batches all these into ONE render
    setCount1((c) => c + 1);
    setCount2((c) => c + 1);
    setCount3((c) => c + 1);
  };

  const handleAsyncUpdates = async () => {
    // React 18+ batches even in async callbacks!
    await new Promise((resolve) => setTimeout(resolve, 100));
    setCount1((c) => c + 1);
    setCount2((c) => c + 1);
    setCount3((c) => c + 1);
  };

  const handleTimeoutUpdates = () => {
    // React 18+ batches in timeouts too
    setTimeout(() => {
      setCount1((c) => c + 1);
      setCount2((c) => c + 1);
      setCount3((c) => c + 1);
    }, 0);
  };

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <RenderTracker name="Batching Demo Component" color="amber">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xs text-zinc-500">Count 1</p>
            <p className="text-2xl font-bold text-amber-400">{count1}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-500">Count 2</p>
            <p className="text-2xl font-bold text-amber-400">{count2}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-500">Count 3</p>
            <p className="text-2xl font-bold text-amber-400">{count3}</p>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-xs text-zinc-500">Total Renders</p>
          <p className="text-3xl font-bold text-rose-400">
            {renderCount.current}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleMultipleUpdates}
            className="flex items-center justify-center gap-2 py-2 px-3 text-xs rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
          >
            <Zap className="w-3 h-3" />
            Sync (3 updates)
          </button>
          <button
            onClick={handleAsyncUpdates}
            className="flex items-center justify-center gap-2 py-2 px-3 text-xs rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors"
          >
            <Zap className="w-3 h-3" />
            Async (3 updates)
          </button>
          <button
            onClick={handleTimeoutUpdates}
            className="flex items-center justify-center gap-2 py-2 px-3 text-xs rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
          >
            <Zap className="w-3 h-3" />
            Timeout (3 updates)
          </button>
        </div>
      </RenderTracker>

      <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <p className="text-sm text-emerald-400">
          <strong>React 18+ Automatic Batching:</strong>
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          All 3 buttons update 3 state values but cause only 1 re-render each.
          Before React 18, async and timeout updates would cause 3 separate
          re-renders!
        </p>
      </div>
    </div>
  );
}
