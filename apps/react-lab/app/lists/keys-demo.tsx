"use client";

import { useState } from "react";
import { RenderTracker } from "@/components/render-tracker";
import { Plus, Shuffle, Trash2 } from "lucide-react";

type Item = { id: number; text: string };

let nextId = 4;

export function KeysDemo() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
    { id: 3, text: "Item 3" },
  ]);

  const addToStart = () => {
    setItems([{ id: nextId++, text: `Item ${nextId - 1}` }, ...items]);
  };

  const shuffle = () => {
    setItems([...items].sort(() => Math.random() - 0.5));
  };

  const removeFirst = () => {
    setItems(items.slice(1));
  };

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={addToStart}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add to Start
        </button>
        <button
          onClick={shuffle}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 text-sm"
        >
          <Shuffle className="w-4 h-4" />
          Shuffle
        </button>
        <button
          onClick={removeFirst}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Remove First
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Bad: Using Index as Key */}
        <div>
          <h4 className="text-sm font-medium text-rose-400 mb-3">
            ❌ key=&#123;index&#125; (Bad)
          </h4>
          <div className="space-y-2">
            {items.map((item, index) => (
              <RenderTracker key={index} name={`Index ${index}`} color="rose">
                <input
                  type="text"
                  defaultValue={item.text}
                  className="w-full px-3 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:border-rose-500"
                />
              </RenderTracker>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            Type in inputs, then shuffle. Watch input values get mixed up!
          </p>
        </div>

        {/* Good: Using ID as Key */}
        <div>
          <h4 className="text-sm font-medium text-emerald-400 mb-3">
            ✓ key=&#123;item.id&#125; (Good)
          </h4>
          <div className="space-y-2">
            {items.map((item) => (
              <RenderTracker
                key={item.id}
                name={`ID ${item.id}`}
                color="emerald"
              >
                <input
                  type="text"
                  defaultValue={item.text}
                  className="w-full px-3 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500"
                />
              </RenderTracker>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            Type in inputs, then shuffle. Input values stay with their items!
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <p className="text-sm text-amber-400">
          <strong>The Bug:</strong>
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          With index keys, React sees "position 0 changed content" and updates
          the DOM node, but the input's internal state (what you typed) stays
          put. With ID keys, React correctly moves the entire DOM node to its
          new position.
        </p>
      </div>
    </div>
  );
}
