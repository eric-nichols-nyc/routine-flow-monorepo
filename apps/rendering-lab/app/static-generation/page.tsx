import { RenderInfo } from "@/components/render-info";
import { CodeBlock } from "@/components/code-block";
import { ExplanationCard } from "@/components/explanation-card";
import {
  FileText,
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// This page is statically generated at build time
// The timestamp will be the same until you rebuild

const staticPosts = [
  { id: 1, title: "Introduction to Next.js", slug: "intro-nextjs" },
  {
    id: 2,
    title: "Understanding React Server Components",
    slug: "react-server-components",
  },
  { id: 3, title: "Building with TypeScript", slug: "typescript-guide" },
];

export default function StaticGenerationPage() {
  const buildTime = new Date().toISOString();

  return (
    <div className="max-w-4xl">
      <RenderInfo
        title="Static Generation (SSG)"
        renderTime={buildTime}
        renderLocation="build"
        description="This page was pre-rendered at build time. Lightning fast delivery from CDN."
      />

      {/* Live Demo Section */}
      <div className="mb-8 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          Live Demo: Static Content
        </h3>

        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-4">
          <p className="text-sm text-amber-400 mb-2">⚡ Build Time Captured:</p>
          <code className="text-lg font-mono text-zinc-100">{buildTime}</code>
          <p className="text-xs text-zinc-500 mt-2">
            Refresh the page — this timestamp stays the same until you rebuild!
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-zinc-400 mb-3">Static Blog Posts:</p>
          {staticPosts.map((post) => (
            <Link
              key={post.id}
              href={`/static-generation/${post.slug}`}
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
            >
              <span className="text-zinc-200">{post.title}</span>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
            </Link>
          ))}
        </div>

        <p className="text-xs text-zinc-500 mt-4">
          ↑ Click a post to see dynamic route static generation with
          generateStaticParams
        </p>
      </div>

      {/* Code Example */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          How It Works
        </h3>
        <CodeBlock
          filename="app/blog/[slug]/page.tsx"
          code={`// generateStaticParams tells Next.js which pages to pre-render
export async function generateStaticParams() {
  const posts = await fetchAllPosts();

  return posts.map((post) => ({
    slug: post.slug, // Creates /blog/intro-nextjs, etc.
  }));
}

export default async function BlogPost({
  params
}: {
  params: { slug: string }
}) {
  const post = await fetchPost(params.slug);

  return <article>{post.content}</article>;
}`}
        />
      </div>

      {/* Build Process Visualization */}
      <div className="mb-8 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          Build Process
        </h3>
        <div className="space-y-4 text-sm text-zinc-400">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              1
            </div>
            <div>
              <p className="text-zinc-200 font-medium">next build</p>
              <p>Next.js runs generateStaticParams() to discover all routes.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              2
            </div>
            <div>
              <p className="text-zinc-200 font-medium">Pre-render Each Page</p>
              <p>Each page is rendered to static HTML with its data.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              3
            </div>
            <div>
              <p className="text-zinc-200 font-medium">Deploy to CDN</p>
              <p>
                Static HTML files are deployed globally. Users get instant
                responses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <ExplanationCard title="Key Benefits" icon={Zap} color="amber">
          <ul className="space-y-1">
            <li>• Fastest possible response times</li>
            <li>• CDN caching worldwide</li>
            <li>• No server compute per request</li>
            <li>• Perfect Lighthouse scores</li>
            <li>• Excellent SEO</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Use Cases" icon={FileText} color="amber">
          <ul className="space-y-1">
            <li>• Marketing pages</li>
            <li>• Blog posts and docs</li>
            <li>• Product listings</li>
            <li>• Landing pages</li>
            <li>• FAQ and help pages</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Advantages" icon={CheckCircle} color="amber">
          <ul className="space-y-1">
            <li>• Pre-computed, instant delivery</li>
            <li>• Scales to millions of users</li>
            <li>• Low hosting costs</li>
            <li>• Works offline with service worker</li>
            <li>• No database load per request</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Limitations" icon={AlertTriangle} color="rose">
          <ul className="space-y-1">
            <li>• Data frozen at build time</li>
            <li>• Rebuild needed for updates</li>
            <li>• Not suitable for personalization</li>
            <li>• Build time grows with pages</li>
            <li>• Can't show real-time data</li>
          </ul>
        </ExplanationCard>
      </div>

      {/* Interview Points */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-zinc-100">
            Interview Talking Points
          </h3>
        </div>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: When would you choose SSG over SSR?
            </strong>
            <p className="mt-1">
              A: When content doesn't change frequently and doesn't need
              personalization. SSG is faster and cheaper to serve.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: How do you handle thousands of pages?
            </strong>
            <p className="mt-1">
              A: Use generateStaticParams() to pre-render key pages, and let
              less-visited pages generate on-demand (fallback behavior).
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: What's the difference between SSG and ISR?
            </strong>
            <p className="mt-1">
              A: SSG generates once at build time. ISR regenerates pages in the
              background after a set time interval, giving you fresh data
              without rebuilding.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
