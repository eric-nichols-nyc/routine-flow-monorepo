"use client";

import { useRef, useEffect, useState } from "react";

interface RenderTrackerProps {
  name: string;
  children: React.ReactNode;
  color?: "blue" | "emerald" | "amber" | "rose" | "violet" | "cyan";
}

const colorClasses = {
  blue: "border-blue-500/30 bg-blue-500/5",
  emerald: "border-emerald-500/30 bg-emerald-500/5",
  amber: "border-amber-500/30 bg-amber-500/5",
  rose: "border-rose-500/30 bg-rose-500/5",
  violet: "border-violet-500/30 bg-violet-500/5",
  cyan: "border-cyan-500/30 bg-cyan-500/5",
};

const badgeColors = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  cyan: "bg-cyan-500",
};

export function RenderTracker({
  name,
  children,
  color = "amber",
}: RenderTrackerProps) {
  const renderCount = useRef(0);
  const [flash, setFlash] = useState(false);

  renderCount.current += 1;

  useEffect(() => {
    setFlash(true);
    const timer = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(timer);
  });

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all duration-300 ${colorClasses[color]} ${
        flash ? "ring-2 ring-amber-400/50 bg-amber-500/10" : ""
      }`}
    >
      <div className="absolute -top-2 -right-2 flex items-center gap-1">
        <span
          className={`px-2 py-0.5 text-xs font-mono rounded-full text-white ${badgeColors[color]}`}
        >
          {renderCount.current}
        </span>
      </div>
      <p className="text-xs text-zinc-500 mb-2 font-mono">{name}</p>
      {children}
    </div>
  );
}
