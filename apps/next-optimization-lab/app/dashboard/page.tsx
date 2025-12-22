import { cookies } from "next/headers";
import { LabShell } from "@/components/lab-shell";
import { MetricsPanel } from "@/components/metrics-panel";
import { getFeaturedProducts, getAllUsers } from "@/lib/db";
import { getTimestamp, createTimer } from "@/lib/timing";
import { User, Shield, AlertTriangle, Settings, LogOut } from "lucide-react";

/**
 * DASHBOARD - Auth & Dynamic Rendering
 *
 * This page demonstrates how authentication affects caching.
 * Using cookies() or headers() makes the route dynamic.
 *
 * Key characteristics:
 * - Accessing cookies/headers opts out of static generation
 * - The page must render per-request to check auth
 * - Solution: Isolate auth checks, cache everything else
 *
 * Patterns to explore:
 * - Check auth at layout level, pass to children
 * - Use Suspense for user-specific data only
 * - Cache non-personalized content separately
 */

async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  // Mock session - in real app, validate the token
  if (sessionCookie?.value) {
    return {
      userId: "user_001",
      userName: "Alice Johnson",
      role: "admin" as const,
    };
  }

  // Demo: Always return a mock session for this lab
  return {
    userId: "user_001",
    userName: "Alice Johnson",
    role: "admin" as const,
  };
}

export default async function DashboardPage() {
  const timer = createTimer();

  // This makes the route DYNAMIC
  // Next.js sees cookies() and knows it can't be statically generated
  const session = await getSession();

  // These could potentially be cached, but the page is already dynamic
  const [featured, users] = await Promise.all([
    getFeaturedProducts(3, 200),
    getAllUsers(150),
  ]);

  const renderTimeMs = timer.elapsed();
  const fetchedAt = getTimestamp();

  return (
    <LabShell
      title="Dashboard (Auth Demo)"
      description="Demonstrates how authentication forces dynamic rendering."
      concept="When you call cookies() or headers(), Next.js automatically switches to dynamic rendering. The route can't be statically generated because it depends on per-request data. The key is to isolate auth checks and cache what you can."
      codeExample={`// This line makes the entire route dynamic
const cookieStore = cookies();
const session = cookieStore.get('session');

// PROBLEM: Now NOTHING on this page can be cached!

// SOLUTION 1: Check auth in layout, cache page content
// layout.tsx
export default async function Layout({ children }) {
  const session = await getSession();  // Dynamic
  return <SessionContext.Provider value={session}>
    {children}  {/* Children can still be cached! */}
  </SessionContext.Provider>;
}

// SOLUTION 2: Use Suspense for personalized content only
export default function Page() {
  return (
    <>
      {/* This is cacheable */}
      <ProductGrid />

      {/* Only this needs dynamic */}
      <Suspense>
        <UserGreeting />  {/* Calls cookies() */}
      </Suspense>
    </>
  );
}`}
      tips={[
        "Check your terminal - this page is always dynamically rendered",
        "The session check forces the entire route to be dynamic",
        "Isolate auth logic to minimize the dynamic 'blast radius'",
      ]}
      warnings={[
        "Don't call cookies() in every component - pass session as prop or context",
        "Consider using middleware for auth checks instead",
        "Static + dynamic = dynamic. One call to cookies() affects everything.",
      ]}
    >
      {/* Auth Status Banner */}
      <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
        <div className="flex items-center gap-2 text-rose-400 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold">
            This page is dynamically rendered
          </span>
        </div>
        <p className="text-sm text-zinc-400">
          Because we called <code className="text-rose-400">cookies()</code> to
          check authentication, Next.js cannot statically generate this page.
          Every request hits the server.
        </p>
      </div>

      {/* Metrics Panel */}
      <MetricsPanel
        metrics={{
          fetchCount: 2,
          renderTimeMs,
          cacheMode: "no-store",
          lastUpdated: fetchedAt,
          notes:
            "Dynamic rendering due to cookies() call. Refresh to see new timestamp.",
        }}
      />

      {/* User Session Card */}
      <div className="mt-8 p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                {session.userName}
              </h2>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-400" />
                <span className="text-sm text-rose-400 capitalize">
                  {session.role}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-zinc-700 text-zinc-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/50">
            <p className="text-xs text-zinc-500 mb-1">User ID</p>
            <p className="font-mono text-sm text-zinc-300">{session.userId}</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/50">
            <p className="text-xs text-zinc-500 mb-1">Session Source</p>
            <p className="font-mono text-sm text-zinc-300">cookies()</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/50">
            <p className="text-xs text-zinc-500 mb-1">Render Mode</p>
            <p className="font-mono text-sm text-rose-400">Dynamic</p>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        {/* Featured Products */}
        <div className="p-5 rounded-xl bg-zinc-800/50 border border-zinc-700">
          <h3 className="font-semibold text-zinc-200 mb-4">
            Featured Products
          </h3>
          <div className="space-y-3">
            {featured.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50"
              >
                <span className="text-zinc-300">{product.name}</span>
                <span className="text-zinc-400">${product.price}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            This data could be cached... but the page is dynamic.
          </p>
        </div>

        {/* Team Members */}
        <div className="p-5 rounded-xl bg-zinc-800/50 border border-zinc-700">
          <h3 className="font-semibold text-zinc-200 mb-4">Team Members</h3>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                  <User className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-zinc-300 text-sm">{user.name}</p>
                  <p className="text-zinc-500 text-xs">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LabShell>
  );
}
