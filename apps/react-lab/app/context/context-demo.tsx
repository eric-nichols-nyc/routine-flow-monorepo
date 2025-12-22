"use client";

import { useState, createContext, useContext, useMemo, memo } from "react";
import { RenderTracker } from "@/components/render-tracker";
import { User, Palette, Settings } from "lucide-react";

// Bad: One big context
const BigContext = createContext<{
  user: string;
  theme: string;
  count: number;
  setUser: (u: string) => void;
  setTheme: (t: string) => void;
  setCount: (c: number) => void;
} | null>(null);

// Good: Split contexts
const UserContext = createContext<{
  user: string;
  setUser: (u: string) => void;
} | null>(null);
const ThemeContext = createContext<{
  theme: string;
  setTheme: (t: string) => void;
} | null>(null);

// Components using the BAD combined context
function BadUserDisplay() {
  const ctx = useContext(BigContext);
  return (
    <RenderTracker name="UserDisplay (Bad)" color="rose">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-rose-400" />
        <span className="text-zinc-300">{ctx?.user}</span>
      </div>
      <p className="text-xs text-zinc-500 mt-1">
        Re-renders on ANY context change
      </p>
    </RenderTracker>
  );
}

function BadThemeDisplay() {
  const ctx = useContext(BigContext);
  return (
    <RenderTracker name="ThemeDisplay (Bad)" color="rose">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-rose-400" />
        <span className="text-zinc-300">{ctx?.theme}</span>
      </div>
      <p className="text-xs text-zinc-500 mt-1">
        Re-renders on ANY context change
      </p>
    </RenderTracker>
  );
}

// Components using GOOD split contexts
const GoodUserDisplay = memo(function GoodUserDisplay() {
  const ctx = useContext(UserContext);
  return (
    <RenderTracker name="UserDisplay (Good)" color="emerald">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-emerald-400" />
        <span className="text-zinc-300">{ctx?.user}</span>
      </div>
      <p className="text-xs text-zinc-500 mt-1">
        Only re-renders when user changes
      </p>
    </RenderTracker>
  );
});

const GoodThemeDisplay = memo(function GoodThemeDisplay() {
  const ctx = useContext(ThemeContext);
  return (
    <RenderTracker name="ThemeDisplay (Good)" color="emerald">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-emerald-400" />
        <span className="text-zinc-300">{ctx?.theme}</span>
      </div>
      <p className="text-xs text-zinc-500 mt-1">
        Only re-renders when theme changes
      </p>
    </RenderTracker>
  );
});

export function ContextDemo() {
  // State for bad context
  const [user, setUser] = useState("Alice");
  const [theme, setTheme] = useState("dark");
  const [count, setCount] = useState(0);

  // Bad: New object every render
  const badValue = { user, theme, count, setUser, setTheme, setCount };

  // Good: Memoized separate values
  const userValue = useMemo(() => ({ user, setUser }), [user]);
  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
        <div className="flex gap-4">
          <button
            onClick={() => setUser(user === "Alice" ? "Bob" : "Alice")}
            className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm"
          >
            Toggle User
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-4 py-2 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 text-sm"
          >
            Toggle Theme
          </button>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-sm"
          >
            Increment Count ({count})
          </button>
        </div>
      </div>

      {/* Bad Example */}
      <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20">
        <h3 className="text-sm font-medium text-rose-400 mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Bad: Single Combined Context
        </h3>
        <BigContext.Provider value={badValue}>
          <div className="grid grid-cols-2 gap-4">
            <BadUserDisplay />
            <BadThemeDisplay />
          </div>
        </BigContext.Provider>
        <p className="text-xs text-zinc-500 mt-4">
          ↑ Click any button - both components re-render even for unrelated
          changes!
        </p>
      </div>

      {/* Good Example */}
      <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
        <h3 className="text-sm font-medium text-emerald-400 mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Good: Split Contexts
        </h3>
        <UserContext.Provider value={userValue}>
          <ThemeContext.Provider value={themeValue}>
            <div className="grid grid-cols-2 gap-4">
              <GoodUserDisplay />
              <GoodThemeDisplay />
            </div>
          </ThemeContext.Provider>
        </UserContext.Provider>
        <p className="text-xs text-zinc-500 mt-4">
          ↑ Each component only re-renders for its own context changes. Count
          changes affect neither!
        </p>
      </div>
    </div>
  );
}
