import type { Metadata } from "next";
import "./globals.css";
import "@repo/design-system/styles/globals.css";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import Link from "next/link";
import {
  Server,
  Monitor,
  FileText,
  RefreshCw,
  Clock,
  Layers,
  Home,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Rendering Lab | Next.js Rendering Methods",
  description: "Interactive demonstrations of all Next.js rendering strategies",
};

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/server-components", label: "Server Components", icon: Server },
  { href: "/client-components", label: "Client Components", icon: Monitor },
  { href: "/static-generation", label: "Static (SSG)", icon: FileText },
  { href: "/server-side-rendering", label: "SSR", icon: RefreshCw },
  { href: "/incremental-static", label: "ISR", icon: Clock },
  { href: "/streaming", label: "Streaming", icon: Layers },
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
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Rendering Lab
                </h1>
                <p className="text-xs text-zinc-500 mt-1">Next.js 16</p>
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200 group"
                  >
                    <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-4 border-t border-zinc-800">
                <div className="px-3 py-2 text-xs text-zinc-600">
                  <p>Each page demonstrates a different rendering strategy.</p>
                  <p className="mt-2">Watch the timestamps and indicators!</p>
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
