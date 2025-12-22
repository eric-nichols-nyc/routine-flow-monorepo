import type { Metadata } from "next";
import "./globals.css";
import "@repo/design-system/styles/globals.css";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import Link from "next/link";
import {
  Home,
  Variable,
  Zap,
  Shield,
  Clock,
  Layers,
  List,
  AlertTriangle,
  Sparkles,
  Loader,
} from "lucide-react";

export const metadata: Metadata = {
  title: "React Lab | React Concepts & Optimization",
  description:
    "Interactive demos of React concepts and performance optimization strategies",
};

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/use-state", label: "useState & useReducer", icon: Variable },
  { href: "/use-memo", label: "useMemo & useCallback", icon: Zap },
  { href: "/react-memo", label: "React.memo", icon: Shield },
  { href: "/use-transition", label: "useTransition", icon: Clock },
  { href: "/lazy-loading", label: "Lazy Loading & Suspense", icon: Loader },
  { href: "/context", label: "Context Performance", icon: Layers },
  { href: "/lists", label: "List Optimization", icon: List },
  { href: "/error-boundaries", label: "Error Boundaries", icon: AlertTriangle },
  { href: "/patterns", label: "Advanced Patterns", icon: Sparkles },
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
            <aside className="w-64 bg-zinc-900/50 border-r border-zinc-800 p-4 flex flex-col gap-2 fixed h-full">
              <div className="mb-6 px-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
                  React Lab
                </h1>
                <p className="text-xs text-zinc-500 mt-1">
                  React 19 + Next.js 16
                </p>
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200 group"
                  >
                    <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-rose-400 transition-colors" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-4 border-t border-zinc-800">
                <div className="px-3 py-2 text-xs text-zinc-600">
                  <p>Watch the render indicators!</p>
                  <p className="mt-2">Yellow flash = component re-rendered</p>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
