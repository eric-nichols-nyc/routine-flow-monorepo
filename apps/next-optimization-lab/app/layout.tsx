import type { Metadata } from "next";
import "./globals.css";
import "@repo/design-system/globals.css";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import Link from "next/link";
import {
  Gauge,
  Timer,
  RefreshCw,
  Tag,
  GitBranch,
  Layers,
  Copy,
  Layout,
  Cloud,
  LayoutDashboard,
  BookOpen,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Next.js Optimization Lab",
  description:
    "Learn data-fetching and performance optimizations in Next.js App Router",
};

const labRoutes = [
  {
    href: "/lab/ssr-baseline",
    label: "SSR Baseline",
    icon: Timer,
    color: "text-red-400",
  },
  {
    href: "/lab/fetch-caching",
    label: "Fetch Caching",
    icon: RefreshCw,
    color: "text-blue-400",
  },
  {
    href: "/lab/tags-invalidation",
    label: "Tags & Invalidation",
    icon: Tag,
    color: "text-violet-400",
  },
  {
    href: "/lab/parallel-vs-waterfall",
    label: "Parallel vs Waterfall",
    icon: GitBranch,
    color: "text-amber-400",
  },
  {
    href: "/lab/suspense-streaming",
    label: "Suspense Streaming",
    icon: Layers,
    color: "text-cyan-400",
  },
  {
    href: "/lab/dedupe-cache",
    label: "Dedupe with cache()",
    icon: Copy,
    color: "text-emerald-400",
  },
  {
    href: "/lab/partial-rendering",
    label: "Partial Rendering",
    icon: Layout,
    color: "text-pink-400",
  },
  {
    href: "/lab/client-cache",
    label: "Client Cache (SWR)",
    icon: Cloud,
    color: "text-indigo-400",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen">
        <ThemeProvider>
          <div className="flex min-h-screen">
            {/* Sidebar Navigation */}
            <aside className="w-72 bg-zinc-900/50 border-r border-zinc-800 p-4 flex flex-col gap-2 fixed h-full overflow-y-auto">
              <Link href="/" className="block mb-6 px-3">
                <div className="flex items-center gap-2">
                  <Gauge className="w-6 h-6 text-orange-400" />
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                      Optimization Lab
                    </h1>
                    <p className="text-xs text-zinc-500">
                      Next.js 16 App Router
                    </p>
                  </div>
                </div>
              </Link>

              <div className="px-3 mb-2">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Labs
                </p>
              </div>

              <nav className="flex flex-col gap-1">
                {labRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200 group"
                  >
                    <route.icon
                      className={`w-4 h-4 ${route.color} opacity-70 group-hover:opacity-100`}
                    />
                    <span className="text-sm font-medium">{route.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="px-3 mt-4 mb-2">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Learn
                </p>
              </div>

              <Link
                href="/docs"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200 group"
              >
                <BookOpen className="w-4 h-4 text-teal-400 opacity-70 group-hover:opacity-100" />
                <span className="text-sm font-medium">Documentation</span>
              </Link>

              <div className="px-3 mt-4 mb-2">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Auth Demo
                </p>
              </div>

              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200 group"
              >
                <LayoutDashboard className="w-4 h-4 text-rose-400 opacity-70 group-hover:opacity-100" />
                <span className="text-sm font-medium">Dashboard (Auth)</span>
              </Link>

              <div className="mt-auto pt-4 border-t border-zinc-800">
                <div className="px-3 py-2 text-xs text-zinc-600 space-y-1">
                  <p>Each lab demonstrates ONE optimization.</p>
                  <p>Check the MetricsPanel for timing.</p>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
