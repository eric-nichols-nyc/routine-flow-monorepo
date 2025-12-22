import { RenderInfo } from "@/components/render-info";
import { CodeBlock } from "@/components/code-block";
import { ExplanationCard } from "@/components/explanation-card";
import { RefreshCw, Zap, User, AlertTriangle, CheckCircle } from "lucide-react";
import { RefreshButton } from "./refresh-button";

// Force dynamic rendering - this page is rendered fresh on every request
export const dynamic = "force-dynamic";

// Simulate fetching live data
async function getLiveData() {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    visitors: Math.floor(Math.random() * 1000) + 500,
    serverLoad: Math.floor(Math.random() * 100),
    lastRequest: new Date().toISOString(),
    region: "us-east-1",
    requestId: crypto.randomUUID().slice(0, 8),
  };
}

export default async function SSRPage() {
  const renderTime = new Date().toISOString();
  const liveData = await getLiveData();

  return (
    <div className="max-w-4xl">
      <RenderInfo
        title="Server-Side Rendering (SSR)"
        renderTime={renderTime}
        renderLocation="server"
        description="This page is rendered fresh on the server for every request. Always up-to-date."
      />

      {/* Live Demo Section */}
      <div className="mb-8 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-100">
            Live Demo: Fresh Data Every Request
          </h3>
          <RefreshButton />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-xs text-zinc-500 mb-1">Active Visitors</p>
            <p className="text-2xl font-bold text-rose-400">
              {liveData.visitors}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-xs text-zinc-500 mb-1">Server Load</p>
            <p className="text-2xl font-bold text-rose-400">
              {liveData.serverLoad}%
            </p>
          </div>
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-xs text-zinc-500 mb-1">Region</p>
            <p className="text-lg font-mono text-zinc-300">{liveData.region}</p>
          </div>
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-xs text-zinc-500 mb-1">Request ID</p>
            <p className="text-lg font-mono text-zinc-300">
              {liveData.requestId}
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-500">
          ↑ Refresh the page — all values change because the server re-renders
          each time!
        </p>
      </div>

      {/* Code Example */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          How It Works
        </h3>
        <CodeBlock
          filename="app/dashboard/page.tsx"
          code={`// Option 1: Export dynamic config
export const dynamic = 'force-dynamic';

// Option 2: Use dynamic functions (auto-detected)
import { cookies, headers } from 'next/headers';

export default async function Dashboard() {
  // These make the page dynamic automatically:
  const userCookie = cookies().get('user');
  const userAgent = headers().get('user-agent');

  // Or fetch with no-store
  const data = await fetch(url, { cache: 'no-store' });

  return <DashboardContent data={data} />;
}`}
        />
      </div>

      {/* Dynamic Triggers */}
      <div className="mb-8 p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          What Triggers SSR?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-400 mb-2 font-medium">
              Explicit Configuration:
            </p>
            <ul className="space-y-1 text-zinc-500">
              <li>
                <code className="text-rose-400">dynamic = 'force-dynamic'</code>
              </li>
              <li>
                <code className="text-rose-400">revalidate = 0</code>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-zinc-400 mb-2 font-medium">
              Auto-detected Dynamic:
            </p>
            <ul className="space-y-1 text-zinc-500">
              <li>
                Using <code className="text-rose-400">cookies()</code> or{" "}
                <code className="text-rose-400">headers()</code>
              </li>
              <li>
                <code className="text-rose-400">searchParams</code> in page
                props
              </li>
              <li>
                <code className="text-rose-400">fetch</code> with{" "}
                <code className="text-rose-400">cache: 'no-store'</code>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <ExplanationCard title="Key Benefits" icon={Zap} color="rose">
          <ul className="space-y-1">
            <li>• Always fresh, up-to-date data</li>
            <li>• Access to request context</li>
            <li>• Personalization per user</li>
            <li>• SEO-friendly (full HTML)</li>
            <li>• Real-time content</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Use Cases" icon={User} color="rose">
          <ul className="space-y-1">
            <li>• User dashboards</li>
            <li>• Live data feeds</li>
            <li>• Personalized content</li>
            <li>• Search results pages</li>
            <li>• Real-time analytics</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Advantages" icon={CheckCircle} color="rose">
          <ul className="space-y-1">
            <li>• Data always current</li>
            <li>• User-specific content</li>
            <li>• Full request context</li>
            <li>• Works with auth/cookies</li>
            <li>• No stale cache issues</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Trade-offs" icon={AlertTriangle} color="amber">
          <ul className="space-y-1">
            <li>• Slower than static (server work)</li>
            <li>• Higher server costs</li>
            <li>• Can't cache at CDN</li>
            <li>• TTFB depends on data fetch</li>
            <li>• Scales with server capacity</li>
          </ul>
        </ExplanationCard>
      </div>

      {/* Interview Points */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="w-5 h-5 text-rose-400" />
          <h3 className="font-semibold text-zinc-100">
            Interview Talking Points
          </h3>
        </div>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: When would you use SSR over SSG?
            </strong>
            <p className="mt-1">
              A: When data must be fresh on every request, when you need request
              context (cookies, headers), or for personalized content like
              dashboards.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: How do you optimize SSR performance?
            </strong>
            <p className="mt-1">
              A: Use streaming with Suspense, cache expensive operations with
              React cache(), parallelize data fetching, and consider edge
              deployment for lower latency.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: What's the difference between SSR and Server Components?
            </strong>
            <p className="mt-1">
              A: Server Components describe WHERE code runs (server only). SSR
              describes WHEN rendering happens (per-request). A Server Component
              can be static or SSR depending on its data dependencies.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
