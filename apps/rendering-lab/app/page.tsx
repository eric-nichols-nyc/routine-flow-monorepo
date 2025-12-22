import {
  Server,
  Monitor,
  FileText,
  RefreshCw,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const renderingMethods = [
  {
    href: "/server-components",
    title: "Server Components",
    icon: Server,
    color: "emerald",
    description:
      "React components that render exclusively on the server. Zero JavaScript sent to client.",
    when: "Default in App Router. Data fetching, database access, keeping secrets server-side.",
    key: "No 'use client' directive",
  },
  {
    href: "/client-components",
    title: "Client Components",
    icon: Monitor,
    color: "blue",
    description:
      "Components that hydrate and run in the browser. Required for interactivity.",
    when: "User interactions, useState, useEffect, browser APIs, event handlers.",
    key: "'use client' directive at top",
  },
  {
    href: "/static-generation",
    title: "Static Generation (SSG)",
    icon: FileText,
    color: "amber",
    description:
      "Pages pre-rendered at build time. Fastest possible performance.",
    when: "Marketing pages, blog posts, documentation, content that doesn't change often.",
    key: "generateStaticParams() function",
  },
  {
    href: "/server-side-rendering",
    title: "Server-Side Rendering (SSR)",
    icon: RefreshCw,
    color: "rose",
    description:
      "Fresh data on every request. Page rendered on the server per request.",
    when: "Personalized content, real-time data, pages that must always be fresh.",
    key: "dynamic = 'force-dynamic'",
  },
  {
    href: "/incremental-static",
    title: "Incremental Static Regeneration (ISR)",
    icon: Clock,
    color: "violet",
    description:
      "Static pages that revalidate after a time interval. Best of both worlds.",
    when: "Content that updates periodically, product pages, news articles.",
    key: "revalidate = seconds",
  },
  {
    href: "/streaming",
    title: "Streaming with Suspense",
    icon: Layers,
    color: "cyan",
    description:
      "Progressive rendering with loading states. Show content as it becomes ready.",
    when: "Pages with slow data sources, improved perceived performance.",
    key: "<Suspense> boundaries",
  },
];

const colorClasses = {
  emerald:
    "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 hover:border-emerald-400/50",
  blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30 hover:border-blue-400/50",
  amber:
    "from-amber-500/20 to-amber-500/5 border-amber-500/30 hover:border-amber-400/50",
  rose: "from-rose-500/20 to-rose-500/5 border-rose-500/30 hover:border-rose-400/50",
  violet:
    "from-violet-500/20 to-violet-500/5 border-violet-500/30 hover:border-violet-400/50",
  cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 hover:border-cyan-400/50",
};

const iconColorClasses = {
  emerald: "text-emerald-400",
  blue: "text-blue-400",
  amber: "text-amber-400",
  rose: "text-rose-400",
  violet: "text-violet-400",
  cyan: "text-cyan-400",
};

export default function HomePage() {
  const buildTime = new Date().toISOString();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Next.js Rendering Methods
          </span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl">
          Explore each rendering strategy with interactive demos. Watch
          timestamps, observe network requests, and understand when to use each
          approach.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full border border-zinc-700">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs text-zinc-400">
            This page rendered at:{" "}
            <code className="text-emerald-400">{buildTime}</code>
          </span>
        </div>
      </div>

      {/* Rendering Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderingMethods.map((method, index) => (
          <Link
            key={method.href}
            href={method.href}
            className={`group relative p-6 rounded-2xl border bg-gradient-to-br transition-all duration-300 hover:scale-[1.02] ${colorClasses[method.color as keyof typeof colorClasses]}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-zinc-900/50 ${iconColorClasses[method.color as keyof typeof iconColorClasses]}`}
              >
                <method.icon className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
            </div>

            <h2 className="text-xl font-semibold text-zinc-100 mb-2">
              {method.title}
            </h2>
            <p className="text-sm text-zinc-400 mb-4">{method.description}</p>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-zinc-500 shrink-0">When:</span>
                <span className="text-zinc-400">{method.when}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-zinc-500 shrink-0">Key:</span>
                <code
                  className={`px-1.5 py-0.5 rounded bg-zinc-800 ${iconColorClasses[method.color as keyof typeof iconColorClasses]}`}
                >
                  {method.key}
                </code>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Reference */}
      <div className="mt-12 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          Quick Reference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-zinc-800">
                <th className="pb-3 text-zinc-400 font-medium">Method</th>
                <th className="pb-3 text-zinc-400 font-medium">Renders</th>
                <th className="pb-3 text-zinc-400 font-medium">
                  Data Freshness
                </th>
                <th className="pb-3 text-zinc-400 font-medium">Performance</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800/50">
                <td className="py-3">Server Components</td>
                <td className="py-3">Server only</td>
                <td className="py-3">Per request</td>
                <td className="py-3">⚡ Excellent</td>
              </tr>
              <tr className="border-b border-zinc-800/50">
                <td className="py-3">Client Components</td>
                <td className="py-3">Server + Client</td>
                <td className="py-3">Client-managed</td>
                <td className="py-3">Good (hydration cost)</td>
              </tr>
              <tr className="border-b border-zinc-800/50">
                <td className="py-3">Static (SSG)</td>
                <td className="py-3">Build time</td>
                <td className="py-3">Build time only</td>
                <td className="py-3">⚡⚡ Best</td>
              </tr>
              <tr className="border-b border-zinc-800/50">
                <td className="py-3">SSR</td>
                <td className="py-3">Per request</td>
                <td className="py-3">Always fresh</td>
                <td className="py-3">Slower (per request)</td>
              </tr>
              <tr className="border-b border-zinc-800/50">
                <td className="py-3">ISR</td>
                <td className="py-3">Background</td>
                <td className="py-3">Periodic</td>
                <td className="py-3">⚡ Excellent</td>
              </tr>
              <tr>
                <td className="py-3">Streaming</td>
                <td className="py-3">Progressive</td>
                <td className="py-3">Per request</td>
                <td className="py-3">⚡ Great UX</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
