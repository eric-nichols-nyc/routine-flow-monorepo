"use client";

import { useState } from "react";
import { useCounter } from "@/hooks/use-counter";
import { useToggle } from "@/hooks/use-toggle";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  Plus,
  Minus,
  RotateCcw,
  Toggle,
  HardDrive,
  Trash2,
} from "lucide-react";

export function HooksDemo() {
  return (
    <div className="space-y-6">
      <CounterDemo />
      <ToggleDemo />
      <LocalStorageDemo />
    </div>
  );
}

function CounterDemo() {
  const { count, increment, decrement, reset, set } = useCounter({
    initialValue: 0,
    min: 0,
    max: 10,
    step: 1,
  });

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">
        useCounter Demo
      </h3>
      <p className="text-sm text-zinc-500 mb-4">
        Bounded counter with min: 0, max: 10
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={decrement}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors"
          aria-label="Decrement"
        >
          <Minus className="w-5 h-5" />
        </button>

        <div className="w-24 text-center">
          <span
            className="text-3xl font-bold text-blue-400"
            data-testid="counter-value"
          >
            {count}
          </span>
        </div>

        <button
          onClick={increment}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors"
          aria-label="Increment"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button
          onClick={reset}
          className="ml-4 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors"
          aria-label="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => set(5)}
          className="px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm transition-colors"
        >
          Set to 5
        </button>
      </div>
    </div>
  );
}

function ToggleDemo() {
  const { value, toggle, setTrue, setFalse } = useToggle(false);

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">
        useToggle Demo
      </h3>
      <p className="text-sm text-zinc-500 mb-4">
        Boolean toggle with convenience methods
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400">Value:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              value
                ? "bg-green-500/20 text-green-400"
                : "bg-zinc-700 text-zinc-400"
            }`}
            data-testid="toggle-value"
          >
            {value ? "ON" : "OFF"}
          </span>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={toggle}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 text-sm transition-colors"
          >
            <Toggle className="w-4 h-4" />
            Toggle
          </button>
          <button
            onClick={setTrue}
            className="px-3 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 text-sm transition-colors"
          >
            Set True
          </button>
          <button
            onClick={setFalse}
            className="px-3 py-2 rounded-lg bg-zinc-700 text-zinc-400 hover:bg-zinc-600 text-sm transition-colors"
          >
            Set False
          </button>
        </div>
      </div>
    </div>
  );
}

function LocalStorageDemo() {
  const { value, setValue, removeValue } = useLocalStorage<string[]>(
    "testing-lab-items",
    [],
  );
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      setValue((prev) => [...prev, newItem.trim()]);
      setNewItem("");
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
        <HardDrive className="w-5 h-5 text-emerald-400" />
        useLocalStorage Demo
      </h3>
      <p className="text-sm text-zinc-500 mb-4">
        Persisted list in localStorage (refresh to verify!)
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Add item..."
          className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          data-testid="storage-input"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
        >
          Add
        </button>
        <button
          onClick={removeValue}
          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          aria-label="Clear all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2" data-testid="storage-items">
        {value.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">No items yet</p>
        ) : (
          value.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-800"
            >
              <span className="text-zinc-300">{item}</span>
              <button
                onClick={() =>
                  setValue((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="text-zinc-500 hover:text-red-400 transition-colors"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
