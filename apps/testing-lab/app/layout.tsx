import type { Metadata } from "next";
import "./globals.css";
import "@repo/design-system/styles/globals.css";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import Link from "next/link";
import {
  Home,
  FlaskConical,
  TestTube2,
  Webhook,
  HardDrive,
  Globe,
  FileCode,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Testing Lab | Vitest & Playwright",
  description:
    "Interactive demos of testing patterns with Vitest and Playwright",
};

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/hooks", label: "Custom Hooks", icon: FlaskConical },
  { href: "/components", label: "Component Tests", icon: TestTube2 },
  { href: "/api-mocking", label: "API Mocking", icon: Webhook },
  { href: "/async", label: "Async Testing", icon: HardDrive },
  { href: "/e2e", label: "E2E with Playwright", icon: Globe },
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
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Testing Lab
                </h1>
                <p className="text-xs text-zinc-500 mt-1">
                  Vitest + Playwright
                </p>
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200 group"
                  >
                    <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-green-400 transition-colors" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-4 border-t border-zinc-800">
                <div className="px-3 py-2 text-xs text-zinc-600 space-y-2">
                  <p className="flex items-center gap-2">
                    <FileCode className="w-3 h-3" />
                    Run tests: <code className="text-green-400">pnpm test</code>
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    E2E: <code className="text-green-400">pnpm test:e2e</code>
                  </p>
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
