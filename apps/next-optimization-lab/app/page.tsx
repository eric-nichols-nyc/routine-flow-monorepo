import Link from "next/link";
import {
  Timer,
  RefreshCw,
  Tag,
  GitBranch,
  Layers,
  Copy,
  Layout,
  Cloud,
  LayoutDashboard,
  ArrowRight,
  Zap,
  Database,
  Globe,
} from "lucide-react";

const labs = [
  {
    href: "/lab/ssr-baseline",
    title: "SSR Baseline",
    icon: Timer,
    color: "red",
    description:
      "Dynamic fetch with cache: 'no-store'. Shows unoptimized TTFB.",
    status: "complete",
  },
  {
    href: "/lab/fetch-caching",
    title: "Fetch Caching",
    icon: RefreshCw,
    color: "blue",
    description: "Time-based revalidation with next: { revalidate }.",
    status: "complete",
  },
  {
    href: "/lab/tags-invalidation",
    title: "Tags & Invalidation",
    icon: Tag,
    color: "violet",
    description: "On-demand cache invalidation with revalidateTag().",
    status: "complete",
  },
  {
    href: "/lab/parallel-vs-waterfall",
    title: "Parallel vs Waterfall",
    icon: GitBranch,
    color: "amber",
    description: "Compare sequential awaits vs Promise.all.",
    status: "complete",
  },
  {
    href: "/lab/suspense-streaming",
    title: "Suspense Streaming",
    icon: Layers,
    color: "cyan",
    description: "Progressive rendering with <Suspense> boundaries.",
    status: "complete",
  },
  {
    href: "/lab/dedupe-cache",
    title: "Dedupe with cache()",
    icon: Copy,
    color: "emerald",
    description: "Request-level deduplication with React cache().",
    status: "complete",
  },
  {
    href: "/lab/partial-rendering",
    title: "Partial Rendering",
    icon: Layout,
    color: "pink",
    description: "Above-the-fold first, rest streams in.",
    status: "complete",
  },
  {
    href: "/lab/client-cache",
    title: "Client Cache",
    icon: Cloud,
    color: "indigo",
    description: "SWR / React Query for client-side data.",
    status: "complete",
  },
];

const colorClasses = {
  red: "from-red-500/20 to-red-500/5 border-red-500/30 hover:border-red-400/50",
  blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30 hover:border-blue-400/50",
  violet:
    "from-violet-500/20 to-violet-500/5 border-violet-500/30 hover:border-violet-400/50",
  amber:
    "from-amber-500/20 to-amber-500/5 border-amber-500/30 hover:border-amber-400/50",
  cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 hover:border-cyan-400/50",
  emerald:
    "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 hover:border-emerald-400/50",
  pink: "from-pink-500/20 to-pink-500/5 border-pink-500/30 hover:border-pink-400/50",
  indigo:
    "from-indigo-500/20 to-indigo-500/5 border-indigo-500/30 hover:border-indigo-400/50",
};

const iconColors = {
  red: "text-red-400",
  blue: "text-blue-400",
  violet: "text-violet-400",
  amber: "text-amber-400",
  cyan: "text-cyan-400",
  emerald: "text-emerald-400",
  pink: "text-pink-400",
  indigo: "text-indigo-400",
};

export default function HomePage() {
  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-zinc-100 mb-4">
          Next.js Optimization Lab
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl">
          An educational project demonstrating{" "}
          <span className="text-orange-400 font-semibold">data-fetching</span>{" "}
          and{" "}
          <span className="text-orange-400 font-semibold">
            performance optimizations
          </span>{" "}
          in the Next.js App Router. Each lab focuses on ONE technique.
        </p>
      </div>

      {/* Key Concepts */}
      <div className="mb-10 grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-orange-400" />
            <h3 className="font-semibold text-zinc-200">Server Components</h3>
          </div>
          <p className="text-sm text-zinc-500">
            Fetch data on the server. Zero client JS for data fetching.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-orange-400" />
            <h3 className="font-semibold text-zinc-200">Caching</h3>
          </div>
          <p className="text-sm text-zinc-500">
            Static, dynamic, and time-based caching strategies.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-orange-400" />
            <h3 className="font-semibold text-zinc-200">Streaming</h3>
          </div>
          <p className="text-sm text-zinc-500">
            Progressive rendering with Suspense boundaries.
          </p>
        </div>
      </div>

      {/* Labs Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-zinc-100 mb-4">Labs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {labs.map((lab) => (
            <Link
              key={lab.href}
              href={lab.href}
              className={`group p-5 rounded-2xl bg-gradient-to-br border transition-all duration-300 hover:scale-[1.02] ${colorClasses[lab.color as keyof typeof colorClasses]}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-xl bg-zinc-900/50 ${iconColors[lab.color as keyof typeof iconColors]}`}
                >
                  <lab.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-100 mb-1 flex items-center gap-2">
                    {lab.title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-sm text-zinc-400">{lab.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Dashboard Link */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20">
        <Link href="/dashboard" className="flex items-center gap-4 group">
          <div className="p-2.5 rounded-xl bg-zinc-900/50 text-rose-400">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-zinc-100 mb-1 flex items-center gap-2">
              Dashboard (Auth Demo)
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h3>
            <p className="text-sm text-zinc-400">
              Mock authenticated page. Shows how cookies force dynamic
              rendering.
            </p>
          </div>
        </Link>
      </div>

      {/* Interview Tips */}
      <div className="mt-10 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Interview Talking Points
        </h2>
        <ul className="space-y-3 text-sm text-zinc-400">
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span>
              <strong className="text-zinc-200">
                RSC vs Client Components:
              </strong>{" "}
              Server Components run only on the server, sending HTML. Client
              Components hydrate and run JS in the browser.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span>
              <strong className="text-zinc-200">Cache Hierarchy:</strong>{" "}
              Request memoization → Data Cache → Full Route Cache → Router Cache
              (client).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span>
              <strong className="text-zinc-200">Static vs Dynamic:</strong>{" "}
              Static routes are generated at build time. Dynamic routes render
              per-request (cookies, headers, no-store).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span>
              <strong className="text-zinc-200">Streaming:</strong> Use{" "}
              {"<Suspense>"} to show a shell immediately while slow data streams
              in progressively.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
