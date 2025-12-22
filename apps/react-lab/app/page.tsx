import {
  Variable,
  Zap,
  Shield,
  Clock,
  Layers,
  List,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Loader,
} from "lucide-react";
import Link from "next/link";

const concepts = [
  {
    href: "/use-state",
    title: "useState & useReducer",
    icon: Variable,
    color: "blue",
    description:
      "State management fundamentals. When to use each hook and common patterns.",
    topics: [
      "Local state",
      "Complex state",
      "State batching",
      "Functional updates",
    ],
  },
  {
    href: "/use-memo",
    title: "useMemo & useCallback",
    icon: Zap,
    color: "amber",
    description:
      "Memoization for expensive calculations and stable function references.",
    topics: [
      "Computation caching",
      "Reference stability",
      "Dependency arrays",
      "When to skip",
    ],
  },
  {
    href: "/react-memo",
    title: "React.memo",
    icon: Shield,
    color: "emerald",
    description: "Prevent unnecessary re-renders with component memoization.",
    topics: [
      "Shallow comparison",
      "Custom comparators",
      "Render visualization",
      "Common pitfalls",
    ],
  },
  {
    href: "/use-transition",
    title: "useTransition & useDeferredValue",
    icon: Clock,
    color: "violet",
    description:
      "Concurrent React features for responsive UIs during heavy updates.",
    topics: [
      "Non-blocking updates",
      "Priority scheduling",
      "Pending states",
      "Large lists",
    ],
  },
  {
    href: "/lazy-loading",
    title: "Lazy Loading & Suspense",
    icon: Loader,
    color: "indigo",
    description:
      "Code splitting and async loading for faster initial page loads.",
    topics: ["React.lazy", "Suspense", "Code splitting", "use() hook"],
  },
  {
    href: "/context",
    title: "Context Performance",
    icon: Layers,
    color: "rose",
    description: "Avoid the context re-render trap with proper patterns.",
    topics: [
      "Context splitting",
      "Memoized providers",
      "Selector patterns",
      "Zustand comparison",
    ],
  },
  {
    href: "/lists",
    title: "List Optimization",
    icon: List,
    color: "cyan",
    description:
      "Keys, virtualization, and efficient list rendering strategies.",
    topics: [
      "Key importance",
      "Windowing",
      "Infinite scroll",
      "Batched updates",
    ],
  },
  {
    href: "/error-boundaries",
    title: "Error Boundaries",
    icon: AlertTriangle,
    color: "orange",
    description: "Graceful error handling with fallback UIs.",
    topics: [
      "Error catching",
      "Recovery patterns",
      "Logging",
      "Suspense integration",
    ],
  },
  {
    href: "/patterns",
    title: "Advanced Patterns",
    icon: Sparkles,
    color: "pink",
    description: "Compound components, render props, and composition patterns.",
    topics: ["Compound components", "Render props", "HOCs", "Custom hooks"],
  },
];

const colorClasses = {
  blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30 hover:border-blue-400/50",
  amber:
    "from-amber-500/20 to-amber-500/5 border-amber-500/30 hover:border-amber-400/50",
  emerald:
    "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 hover:border-emerald-400/50",
  violet:
    "from-violet-500/20 to-violet-500/5 border-violet-500/30 hover:border-violet-400/50",
  rose: "from-rose-500/20 to-rose-500/5 border-rose-500/30 hover:border-rose-400/50",
  cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 hover:border-cyan-400/50",
  orange:
    "from-orange-500/20 to-orange-500/5 border-orange-500/30 hover:border-orange-400/50",
  pink: "from-pink-500/20 to-pink-500/5 border-pink-500/30 hover:border-pink-400/50",
  indigo:
    "from-indigo-500/20 to-indigo-500/5 border-indigo-500/30 hover:border-indigo-400/50",
};

const iconColorClasses = {
  blue: "text-blue-400",
  amber: "text-amber-400",
  emerald: "text-emerald-400",
  violet: "text-violet-400",
  rose: "text-rose-400",
  cyan: "text-cyan-400",
  orange: "text-orange-400",
  pink: "text-pink-400",
  indigo: "text-indigo-400",
};

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
            React Concepts & Optimization
          </span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl">
          Interactive demos to understand React's mental model and master
          performance optimization. Each page includes live examples with render
          visualization.
        </p>
        <div className="mt-6 flex gap-4">
          <div className="px-4 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <span className="text-xs text-zinc-500">React Version</span>
            <p className="text-sm font-mono text-rose-400">19.2.0</p>
          </div>
          <div className="px-4 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <span className="text-xs text-zinc-500">Render Indicator</span>
            <p className="text-sm font-mono text-amber-400">Yellow Flash</p>
          </div>
        </div>
      </div>

      {/* Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept) => (
          <Link
            key={concept.href}
            href={concept.href}
            className={`group relative p-6 rounded-2xl border bg-gradient-to-br transition-all duration-300 hover:scale-[1.02] ${colorClasses[concept.color as keyof typeof colorClasses]}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-zinc-900/50 ${iconColorClasses[concept.color as keyof typeof iconColorClasses]}`}
              >
                <concept.icon className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
            </div>

            <h2 className="text-xl font-semibold text-zinc-100 mb-2">
              {concept.title}
            </h2>
            <p className="text-sm text-zinc-400 mb-4">{concept.description}</p>

            <div className="flex flex-wrap gap-2">
              {concept.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-1 text-xs rounded-md bg-zinc-800/50 text-zinc-500"
                >
                  {topic}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Optimization Mental Model */}
      <div className="mt-12 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          React Optimization Mental Model
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-rose-400">1. Reduce Renders</h4>
            <ul className="text-zinc-400 space-y-1">
              <li>• React.memo for pure components</li>
              <li>• Move state down</li>
              <li>• Lift content up</li>
              <li>• Split contexts</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-amber-400">
              2. Make Renders Cheap
            </h4>
            <ul className="text-zinc-400 space-y-1">
              <li>• useMemo for expensive calculations</li>
              <li>• Virtualize long lists</li>
              <li>• Lazy load components</li>
              <li>• Optimize images</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-emerald-400">3. Defer Work</h4>
            <ul className="text-zinc-400 space-y-1">
              <li>• useTransition for UI updates</li>
              <li>• useDeferredValue for values</li>
              <li>• Suspense for loading</li>
              <li>• Web Workers for CPU work</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 to-orange-500/5 border border-rose-500/20">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          When to Optimize?
        </h3>
        <div className="text-sm text-zinc-400 space-y-3">
          <p>
            <strong className="text-zinc-200">
              ❌ Don't optimize prematurely.
            </strong>{" "}
            React is fast by default. Most apps don't need aggressive
            optimization.
          </p>
          <p>
            <strong className="text-zinc-200">
              ✅ Optimize when you see problems:
            </strong>{" "}
            Laggy inputs, slow scrolling, janky animations, or measurable
            performance issues.
          </p>
          <p>
            <strong className="text-zinc-200">📊 Always measure first</strong>{" "}
            using React DevTools Profiler or Chrome Performance tab before
            adding useMemo/useCallback everywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
