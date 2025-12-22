import {
  FlaskConical,
  TestTube2,
  Webhook,
  HardDrive,
  Globe,
  ArrowRight,
  CheckCircle,
  Code,
  Zap,
} from "lucide-react";
import Link from "next/link";

const topics = [
  {
    href: "/hooks",
    title: "Custom Hooks Testing",
    icon: FlaskConical,
    color: "blue",
    description:
      "Test React hooks using renderHook and act from Testing Library.",
    examples: ["useCounter", "useToggle", "useLocalStorage", "useFetch"],
  },
  {
    href: "/components",
    title: "Component Testing",
    icon: TestTube2,
    color: "violet",
    description:
      "Test React components with render, screen, and user interactions.",
    examples: ["Button", "Form", "Modal", "List rendering"],
  },
  {
    href: "/api-mocking",
    title: "API Mocking with MSW",
    icon: Webhook,
    color: "amber",
    description:
      "Mock API calls using Mock Service Worker for consistent tests.",
    examples: [
      "GET requests",
      "POST requests",
      "Error handling",
      "Dynamic mocks",
    ],
  },
  {
    href: "/async",
    title: "Async Testing",
    icon: HardDrive,
    color: "emerald",
    description: "Handle async operations with waitFor, findBy, and promises.",
    examples: [
      "Loading states",
      "Data fetching",
      "Timeouts",
      "Race conditions",
    ],
  },
  {
    href: "/e2e",
    title: "E2E with Playwright",
    icon: Globe,
    color: "rose",
    description: "End-to-end testing for full user flows across browsers.",
    examples: ["Navigation", "Forms", "Assertions", "Screenshots"],
  },
];

const colorClasses = {
  blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30 hover:border-blue-400/50",
  violet:
    "from-violet-500/20 to-violet-500/5 border-violet-500/30 hover:border-violet-400/50",
  amber:
    "from-amber-500/20 to-amber-500/5 border-amber-500/30 hover:border-amber-400/50",
  emerald:
    "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 hover:border-emerald-400/50",
  rose: "from-rose-500/20 to-rose-500/5 border-rose-500/30 hover:border-rose-400/50",
};

const iconColors = {
  blue: "text-blue-400",
  violet: "text-violet-400",
  amber: "text-amber-400",
  emerald: "text-emerald-400",
  rose: "text-rose-400",
};

export default function HomePage() {
  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-zinc-100 mb-4">Testing Lab</h1>
        <p className="text-lg text-zinc-400 max-w-2xl">
          Learn testing patterns for React applications with{" "}
          <span className="text-green-400 font-semibold">Vitest</span> and{" "}
          <span className="text-green-400 font-semibold">Playwright</span>.
          Explore custom hooks, component testing, API mocking, and E2E tests.
        </p>
      </div>

      {/* Quick Commands */}
      <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-400" />
          Quick Commands
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-zinc-900/50">
            <code className="text-green-400 text-sm">pnpm test</code>
            <p className="text-xs text-zinc-500 mt-1">Run all tests</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900/50">
            <code className="text-green-400 text-sm">pnpm test:watch</code>
            <p className="text-xs text-zinc-500 mt-1">Watch mode</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900/50">
            <code className="text-green-400 text-sm">pnpm test:ui</code>
            <p className="text-xs text-zinc-500 mt-1">Vitest UI</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900/50">
            <code className="text-green-400 text-sm">pnpm test:e2e:ui</code>
            <p className="text-xs text-zinc-500 mt-1">Playwright UI</p>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            className={`group p-6 rounded-2xl bg-gradient-to-br border transition-all duration-300 hover:scale-[1.02] ${colorClasses[topic.color as keyof typeof colorClasses]}`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl bg-zinc-900/50 ${iconColors[topic.color as keyof typeof iconColors]}`}
              >
                <topic.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-zinc-100 mb-2 flex items-center gap-2">
                  {topic.title}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-zinc-400 mb-3">
                  {topic.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {topic.examples.map((ex) => (
                    <span
                      key={ex}
                      className="px-2 py-0.5 text-xs rounded bg-zinc-800/50 text-zinc-500"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Testing Pyramid */}
      <div className="mt-12 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-100 mb-6 flex items-center gap-2">
          <Code className="w-5 h-5 text-green-400" />
          The Testing Pyramid
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-8 bg-rose-500/20 rounded flex items-center justify-center">
              <span className="text-xs text-rose-400 font-medium">E2E</span>
            </div>
            <p className="text-sm text-zinc-400">
              Few, slow, high confidence - test critical user flows
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-36 h-8 bg-amber-500/20 rounded flex items-center justify-center">
              <span className="text-xs text-amber-400 font-medium">
                Integration
              </span>
            </div>
            <p className="text-sm text-zinc-400">
              Some, moderate speed - test component interactions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-48 h-8 bg-green-500/20 rounded flex items-center justify-center">
              <span className="text-xs text-green-400 font-medium">Unit</span>
            </div>
            <p className="text-sm text-zinc-400">
              Many, fast - test individual functions and hooks
            </p>
          </div>
        </div>
      </div>

      {/* What's Covered */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          What You'll Learn
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            "Testing custom React hooks with renderHook",
            "Component testing with Testing Library",
            "Mocking API calls with MSW",
            "Handling async operations in tests",
            "Writing E2E tests with Playwright",
            "Test coverage and best practices",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-sm text-zinc-400"
            >
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
