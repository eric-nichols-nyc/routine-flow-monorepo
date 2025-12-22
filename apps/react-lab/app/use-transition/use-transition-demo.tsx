"use client";

import { useState, useTransition } from "react";
import { RenderTracker } from "@/components/render-tracker";
import { Loader2 } from "lucide-react";

// Simulates expensive content generation
function SlowContent({ items }: { items: number }) {
  const start = performance.now();
  // Simulate slow render
  while (performance.now() - start < 50) {
    // Blocking loop
  }

  return (
    <div className="grid grid-cols-5 gap-1">
      {Array.from({ length: items }, (_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-violet-500/30"
          style={{ opacity: 0.5 + (i % 5) * 0.1 }}
        />
      ))}
    </div>
  );
}

export function UseTransitionDemo() {
  const [tab, setTab] = useState("about");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (newTab: string) => {
    // This update is wrapped in startTransition - it's non-urgent
    startTransition(() => {
      setTab(newTab);
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <RenderTracker name="Tab Container" color="violet">
        {/* Tab Buttons */}
        <div className="flex gap-2 mb-4">
          {["about", "posts", "contact"].map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                tab === t
                  ? "bg-violet-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {isPending && tab !== t && (
                <Loader2 className="inline w-3 h-3 ml-2 animate-spin" />
              )}
            </button>
          ))}
        </div>

        {/* Pending Indicator */}
        {isPending && (
          <div className="flex items-center gap-2 mb-4 text-sm text-violet-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </div>
        )}

        {/* Tab Content */}
        <div
          className={`p-4 rounded-lg bg-zinc-800/50 transition-opacity ${
            isPending ? "opacity-50" : "opacity-100"
          }`}
        >
          {tab === "about" && (
            <div>
              <p className="text-zinc-300 mb-2">About Section</p>
              <SlowContent items={50} />
            </div>
          )}
          {tab === "posts" && (
            <div>
              <p className="text-zinc-300 mb-2">Posts Section (Expensive!)</p>
              <SlowContent items={200} />
            </div>
          )}
          {tab === "contact" && (
            <div>
              <p className="text-zinc-300 mb-2">Contact Section</p>
              <SlowContent items={30} />
            </div>
          )}
        </div>
      </RenderTracker>

      <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <p className="text-sm text-emerald-400">
          <strong>With useTransition:</strong>
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          Click between tabs quickly. The UI stays responsive and shows a
          pending state while the expensive content renders in the background.
          Without useTransition, the UI would freeze during each tab switch.
        </p>
      </div>
    </div>
  );
}
