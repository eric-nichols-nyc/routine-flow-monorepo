"use client";

import { useState, useRef, useEffect } from "react";
import { RenderTracker } from "@/components/render-tracker";
import { Box, Zap } from "lucide-react";

// Generate a large list
const allItems = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i + 1}`,
  color: `hsl(${(i * 36) % 360}, 70%, 50%)`,
}));

// Simple virtualization implementation
function VirtualList({
  items,
  itemHeight,
  containerHeight,
}: {
  items: typeof allItems;
  itemHeight: number;
  containerHeight: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length,
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="overflow-auto rounded-lg bg-zinc-800/50"
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-3 border-b border-zinc-700/50"
              style={{ height: itemHeight }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-zinc-300 text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Regular list (for comparison - limited to 100 items)
function RegularList({ items }: { items: typeof allItems }) {
  return (
    <div
      className="overflow-auto rounded-lg bg-zinc-800/50"
      style={{ height: 300 }}
    >
      {items.slice(0, 100).map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 px-3 py-2 border-b border-zinc-700/50"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-zinc-300 text-sm">{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export function VirtualizationDemo() {
  const [domNodeCount, setDomNodeCount] = useState(0);

  useEffect(() => {
    // Count DOM nodes in the demo
    const interval = setInterval(() => {
      const container = document.querySelector("[data-virtualization-demo]");
      if (container) {
        setDomNodeCount(container.querySelectorAll("div").length);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      {/* Stats */}
      <div className="flex gap-4 mb-4">
        <div className="px-4 py-2 rounded-lg bg-zinc-800/50">
          <p className="text-xs text-zinc-500">Total Items</p>
          <p className="text-xl font-bold text-cyan-400">10,000</p>
        </div>
        <div className="px-4 py-2 rounded-lg bg-zinc-800/50">
          <p className="text-xs text-zinc-500">Visible (~)</p>
          <p className="text-xl font-bold text-emerald-400">~10</p>
        </div>
        <div className="px-4 py-2 rounded-lg bg-zinc-800/50">
          <p className="text-xs text-zinc-500">DOM Nodes</p>
          <p className="text-xl font-bold text-amber-400">{domNodeCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6" data-virtualization-demo>
        {/* Regular List */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Box className="w-4 h-4 text-rose-400" />
            <h4 className="text-sm font-medium text-rose-400">
              Regular List (100 items only)
            </h4>
          </div>
          <RenderTracker name="Regular List" color="rose">
            <RegularList items={allItems} />
          </RenderTracker>
          <p className="text-xs text-zinc-500 mt-2">
            Limited to 100 items or browser would lag
          </p>
        </div>

        {/* Virtualized List */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-medium text-emerald-400">
              Virtualized List (10,000 items!)
            </h4>
          </div>
          <RenderTracker name="Virtual List" color="emerald">
            <VirtualList
              items={allItems}
              itemHeight={36}
              containerHeight={300}
            />
          </RenderTracker>
          <p className="text-xs text-zinc-500 mt-2">
            Scroll smoothly through all 10,000 items!
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <p className="text-sm text-emerald-400">
          <strong>How it works:</strong>
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          The virtualized list only renders items currently in the viewport. As
          you scroll, it calculates which items should be visible and only
          renders those. This keeps DOM node count low regardless of total
          items.
        </p>
      </div>
    </div>
  );
}
