"use client";

import { useState } from "react";
import { RenderTracker } from "@/components/render-tracker";
import { Minus, Plus, RotateCcw } from "lucide-react";

export function UseStateDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <div className="grid grid-cols-2 gap-4">
        <RenderTracker name="Counter" color="blue">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCount((c) => c - 1)}
              className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-3xl font-bold text-blue-400 w-16 text-center">
              {count}
            </span>
            <button
              onClick={() => setCount((c) => c + 1)}
              className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setCount(0)}
            className="mt-3 w-full flex items-center justify-center gap-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </RenderTracker>

        <RenderTracker name="Text Input" color="emerald">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something..."
            className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
          <p className="mt-2 text-xs text-zinc-500">
            Characters: <span className="text-emerald-400">{text.length}</span>
          </p>
        </RenderTracker>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        ↑ Each state update triggers a re-render. Watch the render count badges!
      </p>
    </div>
  );
}
