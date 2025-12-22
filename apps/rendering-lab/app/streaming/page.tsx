import { Suspense } from "react";
import { RenderInfo } from "@/components/render-info";
import { CodeBlock } from "@/components/code-block";
import { ExplanationCard } from "@/components/explanation-card";
import { Layers, Zap, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import {
  SlowComponent,
  FastComponent,
  MediumComponent,
} from "./streaming-components";

export default function StreamingPage() {
  const renderTime = new Date().toISOString();

  return (
    <div className="max-w-4xl">
      <RenderInfo
        title="Streaming with Suspense"
        renderTime={renderTime}
        renderLocation="server"
        description="Progressive rendering. Show content as it becomes ready."
      />

      {/* Live Demo Section */}
      <div className="mb-8 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          Live Demo: Watch Content Stream In
        </h3>
        <p className="text-sm text-zinc-400 mb-6">
          Reload the page and watch each section appear as its data loads.
          Faster data shows first!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Fast Component - loads in 500ms */}
          <Suspense
            fallback={
              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 animate-pulse">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-cyan-500/50 animate-ping" />
                  <span className="text-xs text-cyan-400">Loading fast...</span>
                </div>
                <div className="h-16 bg-zinc-800/50 rounded" />
              </div>
            }
          >
            <FastComponent />
          </Suspense>

          {/* Medium Component - loads in 1500ms */}
          <Suspense
            fallback={
              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 animate-pulse">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-cyan-500/50 animate-ping" />
                  <span className="text-xs text-cyan-400">
                    Loading medium...
                  </span>
                </div>
                <div className="h-16 bg-zinc-800/50 rounded" />
              </div>
            }
          >
            <MediumComponent />
          </Suspense>

          {/* Slow Component - loads in 3000ms */}
          <Suspense
            fallback={
              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 animate-pulse">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-cyan-500/50 animate-ping" />
                  <span className="text-xs text-cyan-400">Loading slow...</span>
                </div>
                <div className="h-16 bg-zinc-800/50 rounded" />
              </div>
            }
          >
            <SlowComponent />
          </Suspense>
        </div>

        <p className="text-xs text-zinc-500 mt-4">
          ↑ Each component has its own Suspense boundary with different loading
          times
        </p>
      </div>

      {/* How Streaming Works */}
      <div className="mb-8 p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          How Streaming Works
        </h3>
        <div className="space-y-4 text-sm">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
              1
            </div>
            <div>
              <p className="text-zinc-200 font-medium">
                Shell Sent Immediately
              </p>
              <p className="text-zinc-400">
                Layout and static content stream to the browser right away.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
              2
            </div>
            <div>
              <p className="text-zinc-200 font-medium">Fallback UI Shows</p>
              <p className="text-zinc-400">
                Each Suspense boundary shows its fallback while data loads.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
              3
            </div>
            <div>
              <p className="text-zinc-200 font-medium">Content Streams In</p>
              <p className="text-zinc-400">
                As each async component resolves, its HTML is streamed and
                replaces the fallback.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
              4
            </div>
            <div>
              <p className="text-zinc-200 font-medium">Hydration Happens</p>
              <p className="text-zinc-400">
                Client Components hydrate as they arrive, becoming interactive
                immediately.
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
          filename="app/dashboard/page.tsx"
          code={`import { Suspense } from 'react';
import { UserProfile } from './user-profile';
import { RecentActivity } from './recent-activity';
import { Recommendations } from './recommendations';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Each section loads independently */}
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile /> {/* Fast: 200ms */}
      </Suspense>

      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity /> {/* Medium: 800ms */}
      </Suspense>

      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations /> {/* Slow: 2000ms */}
      </Suspense>
    </div>
  );
}`}
        />
      </div>

      {/* loading.tsx explanation */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          Alternative: loading.tsx
        </h3>
        <p className="text-sm text-zinc-400 mb-4">
          Next.js automatically wraps your page in a Suspense boundary if you
          create a loading.tsx file in the same folder.
        </p>
        <CodeBlock
          filename="app/dashboard/loading.tsx"
          code={`// This file automatically creates a Suspense boundary
// around the page component in this folder

export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  );
}`}
        />
      </div>

      {/* Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <ExplanationCard title="Key Benefits" icon={Zap} color="cyan">
          <ul className="space-y-1">
            <li>• Better perceived performance</li>
            <li>• Faster Time to First Byte</li>
            <li>• Progressive content display</li>
            <li>• Independent loading states</li>
            <li>• No waterfall blocking</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Use Cases" icon={Layers} color="cyan">
          <ul className="space-y-1">
            <li>• Dashboards with multiple widgets</li>
            <li>• Pages with slow API calls</li>
            <li>• E-commerce with recommendations</li>
            <li>• Social feeds</li>
            <li>• Any page with varied data sources</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Advantages" icon={CheckCircle} color="cyan">
          <ul className="space-y-1">
            <li>• User sees content sooner</li>
            <li>• Parallel data fetching</li>
            <li>• Graceful loading UX</li>
            <li>• Works with Server Components</li>
            <li>• Built into React & Next.js</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard
          title="Considerations"
          icon={AlertTriangle}
          color="amber"
        >
          <ul className="space-y-1">
            <li>• Need to design loading states</li>
            <li>• Layout shifts if not careful</li>
            <li>• More complex error handling</li>
            <li>• SEO: content arrives progressively</li>
            <li>• Testing requires async handling</li>
          </ul>
        </ExplanationCard>
      </div>

      {/* Interview Points */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-zinc-100">
            Interview Talking Points
          </h3>
        </div>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: How does streaming improve performance?
            </strong>
            <p className="mt-1">
              A: The browser starts receiving and rendering HTML immediately
              instead of waiting for all data. Users see the shell and loading
              states in milliseconds, improving perceived performance.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: What's the difference between Suspense for data and code
              splitting?
            </strong>
            <p className="mt-1">
              A: Suspense can be used for both! With React.lazy, it waits for
              component code to load. With async Server Components, it waits for
              data to resolve. Same UI pattern, different triggers.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: How do you handle errors with streaming?
            </strong>
            <p className="mt-1">
              A: Use error.tsx files for route-level errors. For
              component-level, wrap Suspense with ErrorBoundary. Errors in one
              stream don't break others.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
