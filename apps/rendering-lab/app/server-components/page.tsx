import { RenderInfo } from "@/components/render-info";
import { CodeBlock } from "@/components/code-block";
import { ExplanationCard } from "@/components/explanation-card";
import {
  Server,
  Zap,
  Shield,
  Database,
  CheckCircle,
  XCircle,
} from "lucide-react";

// This is a Server Component by default (no 'use client')
// It can directly access databases, environment variables, and server resources

async function getServerData() {
  // Simulate a database call
  await new Promise((resolve) => setTimeout(resolve, 100));
  return {
    users: 1234,
    lastUpdated: new Date().toISOString(),
    secretKey: process.env.SECRET_KEY || "server-only-secret",
  };
}

export default async function ServerComponentsPage() {
  const renderTime = new Date().toISOString();
  const data = await getServerData();

  return (
    <div className="max-w-4xl">
      <RenderInfo
        title="Server Components (RSC)"
        renderTime={renderTime}
        renderLocation="server"
        description="This component rendered entirely on the server. Zero client-side JavaScript."
      />

      {/* Live Demo Section */}
      <div className="mb-8 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          Live Demo: Server Data Access
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-zinc-800/50">
            <p className="text-xs text-zinc-500 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-emerald-400">
              {data.users.toLocaleString()}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-800/50">
            <p className="text-xs text-zinc-500 mb-1">Last Updated</p>
            <p className="text-sm font-mono text-zinc-300">
              {data.lastUpdated}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-800/50">
            <p className="text-xs text-zinc-500 mb-1">Secret (Server Only)</p>
            <p className="text-sm font-mono text-amber-400 truncate">
              {data.secretKey.slice(0, 8)}...
            </p>
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-4">
          ↑ This data was fetched on the server. The secret key is never exposed
          to the client!
        </p>
      </div>

      {/* Code Example */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          How It Works
        </h3>
        <CodeBlock
          filename="app/page.tsx"
          code={`// No 'use client' directive = Server Component
import { db } from '@/lib/database';

async function getUsers() {
  // Direct database access - no API needed!
  return await db.users.findMany();
}

export default async function Page() {
  const users = await getUsers();
  const secret = process.env.SECRET_KEY; // Safe!

  return <UserList users={users} />;
}`}
        />
      </div>

      {/* Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <ExplanationCard title="Key Benefits" icon={Zap} color="emerald">
          <ul className="space-y-1">
            <li>• Zero client-side JavaScript</li>
            <li>• Direct database/API access</li>
            <li>• Keep secrets server-side</li>
            <li>• Smaller bundle sizes</li>
            <li>• Better SEO (full HTML)</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Use Cases" icon={Server} color="emerald">
          <ul className="space-y-1">
            <li>• Data fetching components</li>
            <li>• Database queries</li>
            <li>• File system access</li>
            <li>• Backend service calls</li>
            <li>• Static content display</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Can Do" icon={CheckCircle} color="emerald">
          <ul className="space-y-1">
            <li>• async/await at component level</li>
            <li>• Access process.env secrets</li>
            <li>• Use server-only packages</li>
            <li>• Read files from filesystem</li>
            <li>• Query databases directly</li>
          </ul>
        </ExplanationCard>

        <ExplanationCard title="Cannot Do" icon={XCircle} color="rose">
          <ul className="space-y-1">
            <li>• useState, useEffect</li>
            <li>• onClick, onChange handlers</li>
            <li>• Browser APIs (window, etc.)</li>
            <li>• useContext (client context)</li>
            <li>• Real-time interactivity</li>
          </ul>
        </ExplanationCard>
      </div>

      {/* Interview Points */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-zinc-100">
            Interview Talking Points
          </h3>
        </div>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: How do Server Components improve security?
            </strong>
            <p className="mt-1">
              A: Sensitive data like API keys, database credentials, and
              business logic never leave the server. The client only receives
              the rendered HTML.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: How do they reduce bundle size?
            </strong>
            <p className="mt-1">
              A: Server Component code isn't included in the JavaScript bundle.
              Heavy libraries used only for rendering stay on the server.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: When would you NOT use Server Components?
            </strong>
            <p className="mt-1">
              A: When you need interactivity (event handlers), browser APIs, or
              React state/effects. Those require Client Components.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
