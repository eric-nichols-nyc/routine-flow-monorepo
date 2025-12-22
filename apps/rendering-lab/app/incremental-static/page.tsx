import { RenderInfo } from "@/components/render-info";
import { CodeBlock } from "@/components/code-block";
import { ExplanationCard } from "@/components/explanation-card";
import {
  Clock,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { RefreshButton } from "./refresh-button";

// ISR: Revalidate every 10 seconds
// The page is cached and served instantly, then regenerated in the background
export const revalidate = 10;

// Simulate fetching data that updates periodically
async function getPeriodicData() {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    stockPrice: (150 + Math.random() * 50).toFixed(2),
    temperature: Math.floor(60 + Math.random() * 30),
    newsCount: Math.floor(Math.random() * 100) + 50,
    generatedAt: new Date().toISOString(),
  };
}

export default async function ISRPage() {
  const renderTime = new Date().toISOString();
  const data = await getPeriodicData();

  return (
    <div className="max-w-4xl">
      <RenderInfo
        title="Incremental Static Regeneration (ISR)"
        renderTime={renderTime}
        renderLocation="server"
        description="Static speed + fresh data. Cached, then regenerated in background every 10 seconds."
      />

      {/* Live Demo Section */}
      <div className="mb-8 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-100">
            Live Demo: Cached with Background Revalidation
          </h3>
          <RefreshButton />
        </div>

        <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-400">Page Generated At:</span>
          </div>
          <code className="text-lg font-mono text-zinc-100">
            {data.generatedAt}
          </code>
          <p className="text-xs text-zinc-500 mt-2">
            Revalidates every{" "}
            <strong className="text-violet-400">10 seconds</strong>. First
            request after 10s triggers background regeneration.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-zinc-800/50">
            <p className="text-xs text-zinc-500 mb-1">Stock Price</p>
            <p className="text-2xl font-bold text-violet-400">
              ${data.stockPrice}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-800/50">
            <p className="text-xs text-zinc-500 mb-1">Temperature</p>
            <p className="text-2xl font-bold text-violet-400">
              {data.temperature}°F
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-800/50">
            <p className="text-xs text-zinc-500 mb-1">News Articles</p>
            <p className="text-2xl font-bold text-violet-400">
              {data.newsCount}
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-500 mt-4">
          ↑ Refresh quickly: values stay same (cached). Wait 10+ seconds, then
          refresh: values change!
        </p>
      </div>

      {/* How ISR Works Visualization */}
      <div className="mb-8 p-6 rounded-2xl bg-violet-500/5 border border-violet-500/20">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          How ISR Works
        </h3>
        <div className="space-y-4 text-sm">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
              1
            </div>
            <div>
              <p className="text-zinc-200 font-medium">First Request</p>
              <p className="text-zinc-400">
                Page renders and gets cached. User sees it instantly.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
              2
            </div>
            <div>
              <p className="text-zinc-200 font-medium">
                During Revalidation Period
              </p>
              <p className="text-zinc-400">
                All requests served from cache instantly (like SSG).
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
              3
            </div>
            <div>
              <p className="text-zinc-200 font-medium">
                After Revalidation Period
              </p>
              <p className="text-zinc-400">
                First request still gets cached version, but triggers background
                regeneration.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
              4
            </div>
            <div>
              <p className="text-zinc-200 font-medium">Next Request</p>
              <p className="text-zinc-400">
                Gets the freshly regenerated page. Cycle repeats.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          How It Works
        </h3>
        <CodeBlock
          filename="app/news/page.tsx"
          code={`// Option 1: Route segment config
export const revalidate = 60; // Revalidate every 60 seconds

// Option 2: Per-fetch revalidation
async function getNews() {
  const res = await fetch('https://api.news.com/latest', {
    next: { revalidate: 60 } // Revalidate this data every 60s
  });
  return res.json();
}

export default async function NewsPage() {
  const news = await getNews();
  return <NewsList items={news} />;
}

// Option 3: On-demand revalidation (via API route)
// revalidatePath('/news') or revalidateTag('news')`}
        />
      </div>

      {/* Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <ExplanationCard title="Key Benefits" icon={Zap} color="violet">
          <ul className="space-y-1">
            <li>• Static speed + fresh data</li>
            <li>• CDN caching</li>
            <li>• No user waits for regeneration</li>
            <li>• Scales infinitely</li>
            <li>• Lower server costs than SSR</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Use Cases" icon={Clock} color="violet">
          <ul className="space-y-1">
            <li>• News articles</li>
            <li>• Product catalogs</li>
            <li>• Blog posts with comments</li>
            <li>• Sports scores</li>
            <li>• Weather data</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Advantages" icon={CheckCircle} color="violet">
          <ul className="space-y-1">
            <li>• Best of static + dynamic</li>
            <li>• Users never see loading</li>
            <li>• Graceful freshness</li>
            <li>• On-demand revalidation option</li>
            <li>• Predictable performance</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Trade-offs" icon={AlertTriangle} color="amber">
          <ul className="space-y-1">
            <li>• Data can be up to revalidate seconds old</li>
            <li>• First user after stale gets old data</li>
            <li>• Not suitable for real-time needs</li>
            <li>• Background work can fail silently</li>
            <li>• More complex than pure static</li>
          </ul>
        </ExplanationCard>
      </div>

      {/* Revalidation Methods */}
      <div className="mb-8 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          Revalidation Methods
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-zinc-800/50">
            <p className="text-violet-400 font-medium mb-2">Time-based</p>
            <code className="text-xs text-zinc-400">
              export const revalidate = 60
            </code>
            <p className="text-xs text-zinc-500 mt-2">
              Automatically revalidate after X seconds
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-800/50">
            <p className="text-violet-400 font-medium mb-2">On-demand (Path)</p>
            <code className="text-xs text-zinc-400">
              revalidatePath('/blog/post-1')
            </code>
            <p className="text-xs text-zinc-500 mt-2">
              Trigger from webhook, CMS, or admin action
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-800/50">
            <p className="text-violet-400 font-medium mb-2">On-demand (Tag)</p>
            <code className="text-xs text-zinc-400">
              revalidateTag('posts')
            </code>
            <p className="text-xs text-zinc-500 mt-2">
              Invalidate all data tagged with 'posts'
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-800/50">
            <p className="text-violet-400 font-medium mb-2">Per-fetch</p>
            <code className="text-xs text-zinc-400">{`fetch(url, { next: { revalidate: 60 } })`}</code>
            <p className="text-xs text-zinc-500 mt-2">
              Different revalidation per data source
            </p>
          </div>
        </div>
      </div>

      {/* Interview Points */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="w-5 h-5 text-violet-400" />
          <h3 className="font-semibold text-zinc-100">
            Interview Talking Points
          </h3>
        </div>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: How is ISR different from SSR with caching?
            </strong>
            <p className="mt-1">
              A: ISR is built into Next.js with stale-while-revalidate
              semantics. The regeneration happens in the background, so no user
              ever waits. It's automatic and works at the edge.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: When would you use on-demand vs time-based revalidation?
            </strong>
            <p className="mt-1">
              A: Time-based for predictable updates (weather, news). On-demand
              when you control the source (CMS publish, admin updates, webhook
              from external service).
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: What happens if background regeneration fails?
            </strong>
            <p className="mt-1">
              A: The old cached version continues to be served. This is a key
              benefit — ISR is resilient to failures.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
