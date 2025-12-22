"use client";

import { useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";

export function InteractiveCounter() {
  const [count, setCount] = useState(0);
  const [hydrationTime] = useState(() => new Date().toISOString());

  return (
    <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
      <p className="text-xs text-zinc-500 mb-3">Interactive Counter</p>

      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => setCount((c) => c - 1)}
          className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors"
          aria-label="Decrease"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="text-4xl font-bold text-blue-400 w-16 text-center">
          {count}
        </span>

        <button
          onClick={() => setCount((c) => c + 1)}
          className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors"
          aria-label="Increase"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={() => setCount(0)}
        className="w-full flex items-center justify-center gap-2 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        Reset
      </button>

      <div className="mt-3 pt-3 border-t border-zinc-700">
        <p className="text-xs text-zinc-600">
          Hydrated at: <span className="text-blue-400">{hydrationTime}</span>
        </p>
      </div>
    </div>
  );
}
