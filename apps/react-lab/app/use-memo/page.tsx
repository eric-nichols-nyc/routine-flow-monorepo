import { Zap } from "lucide-react";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { UseMemoDemo } from "./use-memo-demo";
import { UseCallbackDemo } from "./use-callback-demo";

export default function UseMemoPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              useMemo & useCallback
            </h1>
            <p className="text-sm text-zinc-400">
              Memoization hooks for performance optimization
            </p>
          </div>
        </div>
      </div>

      {/* useMemo Demo */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          useMemo: Cache Expensive Calculations
        </h2>
        <UseMemoDemo />
      </div>

      {/* useCallback Demo */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          useCallback: Stable Function References
        </h2>
        <UseCallbackDemo />
      </div>

      {/* When to Use */}
      <Section title="When to Use?" icon={Zap} color="amber">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-amber-400 mb-2">useMemo</h4>
            <ul className="text-zinc-400 space-y-1">
              <li>
                • Expensive calculations (sorting, filtering large arrays)
              </li>
              <li>• Creating new objects/arrays passed to memoized children</li>
              <li>• Deriving state from props</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-emerald-400 mb-2">useCallback</h4>
            <ul className="text-zinc-400 space-y-1">
              <li>• Functions passed to memoized children (React.memo)</li>
              <li>• Functions in dependency arrays of other hooks</li>
              <li>• Event handlers passed to many list items</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Code Examples */}
      <div className="mt-8 space-y-6">
        <CodeBlock
          filename="useMemo-example.tsx"
          code={`// Without useMemo: recalculates on EVERY render
const sorted = items.sort((a, b) => a.name.localeCompare(b.name));

// With useMemo: only recalculates when items changes
const sorted = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);`}
        />

        <CodeBlock
          filename="useCallback-example.tsx"
          code={`// Without useCallback: new function reference every render
// This breaks React.memo on Child!
const handleClick = () => setCount(c => c + 1);

// With useCallback: stable reference across renders
const handleClick = useCallback(
  () => setCount(c => c + 1),
  [] // Empty deps = never changes
);

// Now Child won't re-render if other state changes
<MemoizedChild onClick={handleClick} />`}
        />
      </div>

      {/* Warning */}
      <div className="mt-8 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20">
        <h3 className="font-semibold text-rose-400 mb-3">
          ⚠️ Don't Over-Optimize!
        </h3>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">Memoization has a cost.</strong>{" "}
            React must compare dependencies on every render. For simple
            calculations, this overhead can be worse than just recalculating.
          </li>
          <li>
            <strong className="text-zinc-200">Profile first.</strong> Use React
            DevTools Profiler to find actual bottlenecks before adding
            useMemo/useCallback everywhere.
          </li>
          <li>
            <strong className="text-zinc-200">Start without them.</strong> Only
            add memoization when you have measured a performance problem.
          </li>
        </ul>
      </div>

      {/* Interview Points */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20">
        <h3 className="font-semibold text-zinc-100 mb-4">
          Interview Talking Points
        </h3>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: What's the difference between useMemo and useCallback?
            </strong>
            <p className="mt-1">
              A: useMemo memoizes a VALUE (result of a function), useCallback
              memoizes the FUNCTION itself. useCallback(fn, deps) is equivalent
              to useMemo(() =&gt; fn, deps).
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: When would useMemo actually help?
            </strong>
            <p className="mt-1">
              A: When you have expensive calculations that don't need to run on
              every render, or when you need referential equality for
              objects/arrays passed to memoized children.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: Why doesn't React memoize everything automatically?
            </strong>
            <p className="mt-1">
              A: Memoization trades memory for CPU. React can't know which
              values are expensive to compute or which need referential
              stability, so it's left to the developer.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
