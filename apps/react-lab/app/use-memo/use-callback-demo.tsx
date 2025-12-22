"use client";

import { useState, useCallback, memo } from "react";
import { RenderTracker } from "@/components/render-tracker";

// Memoized child component - only re-renders if props change
const MemoizedButton = memo(function Button({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <RenderTracker name={`Button: ${label}`} color="emerald">
      <button
        onClick={onClick}
        className="w-full py-2 px-4 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors text-sm"
      >
        {label}
      </button>
    </RenderTracker>
  );
});

export function UseCallbackDemo() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [other, setOther] = useState(0);

  // WITHOUT useCallback - new function every render
  const handleIncrement1 = () => setCount1((c) => c + 1);

  // WITH useCallback - stable function reference
  const handleIncrement2 = useCallback(() => setCount2((c) => c + 1), []);

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-4 rounded-xl bg-zinc-800/50">
          <p className="text-xs text-zinc-500 mb-1">Count 1</p>
          <p className="text-2xl font-bold text-rose-400">{count1}</p>
          <p className="text-xs text-rose-400 mt-1">No useCallback</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-zinc-800/50">
          <p className="text-xs text-zinc-500 mb-1">Count 2</p>
          <p className="text-2xl font-bold text-emerald-400">{count2}</p>
          <p className="text-xs text-emerald-400 mt-1">With useCallback</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-zinc-800/50">
          <p className="text-xs text-zinc-500 mb-1">Other State</p>
          <p className="text-2xl font-bold text-violet-400">{other}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MemoizedButton onClick={handleIncrement1} label="Increment 1" />
        <MemoizedButton onClick={handleIncrement2} label="Increment 2" />
        <RenderTracker name="Update Other" color="violet">
          <button
            onClick={() => setOther((o) => o + 1)}
            className="w-full py-2 px-4 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors text-sm"
          >
            Update Other State
          </button>
        </RenderTracker>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
        <p className="text-sm text-rose-400 mb-2">
          <strong>Watch the render counts:</strong>
        </p>
        <ul className="text-xs text-zinc-400 space-y-1">
          <li>
            • Click "Update Other State" → Button 1 re-renders (new function
            reference)
          </li>
          <li>
            • Button 2 does NOT re-render (useCallback provides stable
            reference)
          </li>
          <li>
            • Both buttons are wrapped in React.memo, but only useCallback makes
            it work!
          </li>
        </ul>
      </div>
    </div>
  );
}
