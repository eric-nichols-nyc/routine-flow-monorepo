import { RenderInfo } from "@/components/render-info";
import { CodeBlock } from "@/components/code-block";
import { ExplanationCard } from "@/components/explanation-card";
import {
  Monitor,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { InteractiveCounter } from "./interactive-counter";
import { MouseTracker } from "./mouse-tracker";

export default function ClientComponentsPage() {
  const serverRenderTime = new Date().toISOString();

  return (
    <div className="max-w-4xl">
      <RenderInfo
        title="Client Components"
        renderTime={serverRenderTime}
        renderLocation="client"
        description="Components that hydrate in the browser. Required for interactivity."
      />

      {/* Live Demo Section */}
      <div className="mb-8 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          Live Demo: Interactive Components
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InteractiveCounter />
          <MouseTracker />
        </div>

        <p className="text-xs text-zinc-500 mt-4">
          ↑ These components use useState and event handlers — only possible
          with 'use client'
        </p>
      </div>

      {/* Code Example */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          How It Works
        </h3>
        <CodeBlock
          filename="components/counter.tsx"
          code={`'use client'; // ← This makes it a Client Component

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}`}
        />
      </div>

      {/* Hydration Explanation */}
      <div className="mb-8 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          Understanding Hydration
        </h3>
        <div className="space-y-4 text-sm text-zinc-400">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
              1
            </div>
            <div>
              <p className="text-zinc-200 font-medium">Server Renders HTML</p>
              <p>
                The component renders on the server first, producing static HTML
                for fast initial load and SEO.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
              2
            </div>
            <div>
              <p className="text-zinc-200 font-medium">JavaScript Loads</p>
              <p>The client downloads the component's JavaScript bundle.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
              3
            </div>
            <div>
              <p className="text-zinc-200 font-medium">
                Hydration Attaches Interactivity
              </p>
              <p>
                React "hydrates" the HTML, attaching event listeners and making
                it interactive.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <ExplanationCard title="Key Benefits" icon={Zap} color="blue">
          <ul className="space-y-1">
            <li>• Full interactivity</li>
            <li>• useState, useEffect, etc.</li>
            <li>• Event handlers</li>
            <li>• Browser APIs access</li>
            <li>• Real-time updates</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Use Cases" icon={Monitor} color="blue">
          <ul className="space-y-1">
            <li>• Forms and inputs</li>
            <li>• Buttons with onClick</li>
            <li>• Animations</li>
            <li>• Modals and dropdowns</li>
            <li>• Real-time features</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Can Do" icon={CheckCircle} color="blue">
          <ul className="space-y-1">
            <li>• useState, useReducer</li>
            <li>• useEffect, useLayoutEffect</li>
            <li>• onClick, onChange, etc.</li>
            <li>• window, document, localStorage</li>
            <li>• Custom hooks with state</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Trade-offs" icon={AlertTriangle} color="amber">
          <ul className="space-y-1">
            <li>• Larger JavaScript bundles</li>
            <li>• Hydration delay</li>
            <li>• No direct server access</li>
            <li>• Secrets exposed if included</li>
            <li>• More client-side work</li>
          </ul>
        </ExplanationCard>
      </div>

      {/* Composition Pattern */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          Best Practice: Composition
        </h3>
        <p className="text-sm text-zinc-400 mb-4">
          Push 'use client' as far down the component tree as possible. Server
          Components can import and render Client Components.
        </p>
        <CodeBlock
          filename="app/dashboard/page.tsx"
          code={`// Server Component - no 'use client'
import { db } from '@/lib/database';
import { LikeButton } from './like-button'; // Client Component

export default async function Dashboard() {
  const posts = await db.posts.findMany();

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {/* Only the button needs client JS */}
          <LikeButton postId={post.id} />
        </article>
      ))}
    </div>
  );
}`}
        />
      </div>

      {/* Interview Points */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-zinc-100">
            Interview Talking Points
          </h3>
        </div>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: What triggers the need for 'use client'?
            </strong>
            <p className="mt-1">
              A: Using useState, useEffect, event handlers, browser APIs, or any
              React hook that manages state or side effects.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: Does 'use client' mean it only runs on the client?
            </strong>
            <p className="mt-1">
              A: No! It still renders on the server for the initial HTML. 'use
              client' marks the boundary where hydration is needed.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: How do you optimize Client Components?
            </strong>
            <p className="mt-1">
              A: Keep them small and focused. Use composition to limit the
              client boundary. Consider dynamic imports for large interactive
              sections.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
