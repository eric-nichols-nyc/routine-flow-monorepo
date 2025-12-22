"use client";

import { useState, memo, useCallback } from "react";
import { RenderTracker } from "@/components/render-tracker";
import { User } from "lucide-react";

// Regular component - re-renders whenever parent re-renders
function RegularChild({ name }: { name: string }) {
  return (
    <RenderTracker name="Regular Child" color="rose">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-rose-400" />
        <span className="text-zinc-300">{name}</span>
      </div>
      <p className="text-xs text-zinc-500 mt-1">No memoization</p>
    </RenderTracker>
  );
}

// Memoized component - only re-renders if props change
const MemoizedChild = memo(function MemoizedChild({ name }: { name: string }) {
  return (
    <RenderTracker name="Memoized Child" color="emerald">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-emerald-400" />
        <span className="text-zinc-300">{name}</span>
      </div>
      <p className="text-xs text-zinc-500 mt-1">React.memo applied</p>
    </RenderTracker>
  );
});

// Memoized but with function prop (without useCallback)
const MemoizedWithFn = memo(function MemoizedWithFn({
  name,
  onClick,
}: {
  name: string;
  onClick: () => void;
}) {
  return (
    <RenderTracker name="Memoized + Function Prop" color="amber">
      <button
        onClick={onClick}
        className="flex items-center gap-2 w-full text-left"
      >
        <User className="w-4 h-4 text-amber-400" />
        <span className="text-zinc-300">{name}</span>
      </button>
      <p className="text-xs text-zinc-500 mt-1">
        memo + inline function = broken!
      </p>
    </RenderTracker>
  );
});

// Memoized with useCallback function prop (works correctly)
const MemoizedWithCallback = memo(function MemoizedWithCallback({
  name,
  onClick,
}: {
  name: string;
  onClick: () => void;
}) {
  return (
    <RenderTracker name="Memoized + useCallback" color="cyan">
      <button
        onClick={onClick}
        className="flex items-center gap-2 w-full text-left"
      >
        <User className="w-4 h-4 text-cyan-400" />
        <span className="text-zinc-300">{name}</span>
      </button>
      <p className="text-xs text-zinc-500 mt-1">memo + useCallback = works!</p>
    </RenderTracker>
  );
});

export function ReactMemoDemo() {
  const [count, setCount] = useState(0);
  const [name] = useState("Alice");

  // Inline function - breaks memoization
  const inlineHandler = () => console.log("clicked");

  // useCallback - preserves memoization
  const stableHandler = useCallback(() => console.log("clicked"), []);

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      {/* Parent State Control */}
      <RenderTracker name="Parent Component" color="violet">
        <div className="flex items-center justify-between">
          <span className="text-zinc-300">Parent render trigger</span>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-violet-400">{count}</span>
            <button
              onClick={() => setCount((c) => c + 1)}
              className="px-4 py-2 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors text-sm"
            >
              Update Parent
            </button>
          </div>
        </div>
      </RenderTracker>

      {/* Children Grid */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <RegularChild name={name} />
        <MemoizedChild name={name} />
        <MemoizedWithFn name={name} onClick={inlineHandler} />
        <MemoizedWithCallback name={name} onClick={stableHandler} />
      </div>

      <div className="mt-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
        <p className="text-sm text-zinc-400">
          <strong className="text-zinc-200">
            Click "Update Parent" and watch:
          </strong>
        </p>
        <ul className="text-xs text-zinc-500 mt-2 space-y-1">
          <li>
            • <span className="text-rose-400">Regular Child</span> - re-renders
            every time
          </li>
          <li>
            • <span className="text-emerald-400">Memoized Child</span> - stays
            at 1 render (props unchanged)
          </li>
          <li>
            • <span className="text-amber-400">Memoized + Inline Function</span>{" "}
            - re-renders (function reference changes)
          </li>
          <li>
            • <span className="text-cyan-400">Memoized + useCallback</span> -
            stays at 1 render (stable reference)
          </li>
        </ul>
      </div>
    </div>
  );
}
