"use client";

import { Component, useState, type ReactNode } from "react";
import { RenderTracker } from "@/components/render-tracker";
import { AlertTriangle, RefreshCw, Bomb, Shield } from "lucide-react";

// Error Boundary Class Component
class ErrorBoundary extends Component<
  { children: ReactNode; name: string },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[${this.props.name}] Error caught:`, error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
          <div className="flex items-center gap-2 text-rose-400 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Error in {this.props.name}</span>
          </div>
          <p className="text-sm text-zinc-400 mb-3">
            {this.state.error?.message}
          </p>
          <button
            onClick={this.reset}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Component that throws an error
function BuggyCounter({ shouldThrow }: { shouldThrow: boolean }) {
  const [count, setCount] = useState(0);

  if (shouldThrow && count >= 3) {
    throw new Error("Counter crashed at 3!");
  }

  return (
    <RenderTracker name="Buggy Counter" color="amber">
      <div className="flex items-center justify-between">
        <span className="text-zinc-300">Count: {count}</span>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-3 py-1 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-sm"
        >
          Increment
        </button>
      </div>
      {shouldThrow && (
        <p className="text-xs text-rose-400 mt-2">Crashes at 3!</p>
      )}
    </RenderTracker>
  );
}

// Safe component that never throws
function SafeCounter() {
  const [count, setCount] = useState(0);

  return (
    <RenderTracker name="Safe Counter" color="emerald">
      <div className="flex items-center justify-between">
        <span className="text-zinc-300">Count: {count}</span>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-sm"
        >
          Increment
        </button>
      </div>
      <p className="text-xs text-emerald-400 mt-2">Always works!</p>
    </RenderTracker>
  );
}

export function ErrorBoundaryDemo() {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <div className="grid grid-cols-2 gap-6">
        {/* Without Error Boundary */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bomb className="w-4 h-4 text-rose-400" />
            <h4 className="text-sm font-medium text-rose-400">No Boundary</h4>
          </div>
          <div className="space-y-3">
            <BuggyCounter shouldThrow={false} />
            <SafeCounter />
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            If either crashes, both would unmount (in real app)
          </p>
        </div>

        {/* With Error Boundary */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-medium text-emerald-400">
              With Boundary
            </h4>
          </div>
          <div className="space-y-3">
            <ErrorBoundary name="Buggy Counter">
              <BuggyCounter shouldThrow={true} />
            </ErrorBoundary>
            <ErrorBoundary name="Safe Counter">
              <SafeCounter />
            </ErrorBoundary>
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            Click to 3 → only buggy counter crashes. Safe counter still works!
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <p className="text-sm text-amber-400">
          <strong>Try it:</strong>
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          In the "With Boundary" section, increment the buggy counter to 3. It
          will crash and show an error UI, but the safe counter below keeps
          working. Click "Try Again" to recover the buggy counter.
        </p>
      </div>
    </div>
  );
}
