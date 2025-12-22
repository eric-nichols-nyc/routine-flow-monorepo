import { Loader } from "lucide-react";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { LazyLoadingDemo } from "./lazy-loading-demo";
import { SuspenseDemo } from "./suspense-demo";

export default function LazyLoadingPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Loader className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              Lazy Loading & Suspense
            </h1>
            <p className="text-sm text-zinc-400">
              Code splitting and async loading for better performance
            </p>
          </div>
        </div>
      </div>

      {/* React.lazy Demo */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          React.lazy: Load Components On-Demand
        </h2>
        <LazyLoadingDemo />
      </div>

      {/* Suspense Demo */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Suspense: Declarative Loading States
        </h2>
        <SuspenseDemo />
      </div>

      {/* How It Works */}
      <Section title="How Code Splitting Works" icon={Loader} color="violet">
        <div className="space-y-3 text-sm text-zinc-400">
          <p>
            <strong className="text-zinc-200">Without lazy loading:</strong>{" "}
            Your entire app is bundled into one large JavaScript file. Users
            download everything upfront, even features they may never use.
          </p>
          <p>
            <strong className="text-zinc-200">With lazy loading:</strong>{" "}
            Components are split into separate chunks. They're only downloaded
            when the user navigates to that feature, reducing initial load time.
          </p>
        </div>
      </Section>

      {/* Code Examples */}
      <div className="mt-8 space-y-6">
        <CodeBlock
          filename="lazy-component.tsx"
          code={`import { lazy, Suspense } from 'react';

// Instead of: import HeavyChart from './HeavyChart';
const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart data={data} />
      </Suspense>
    </div>
  );
}`}
        />

        <CodeBlock
          filename="route-based-splitting.tsx"
          code={`// Next.js App Router does this automatically!
// Each page in /app is a separate chunk

// For manual splitting in components:
const AdminPanel = lazy(() => import('./AdminPanel'));
const Settings = lazy(() => import('./Settings'));

function App() {
  return (
    <Routes>
      <Route path="/admin" element={
        <Suspense fallback={<Loading />}>
          <AdminPanel />
        </Suspense>
      } />
    </Routes>
  );
}`}
        />

        <CodeBlock
          filename="named-exports.tsx"
          code={`// For named exports, use this pattern:
const MyComponent = lazy(() =>
  import('./MyModule').then(module => ({
    default: module.MyNamedComponent
  }))
);

// Or with Next.js dynamic:
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('./Chart'), {
  loading: () => <Skeleton />,
  ssr: false // Disable SSR for client-only components
});`}
        />
      </div>

      {/* When to Use */}
      <div className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
        <h3 className="font-semibold text-emerald-400 mb-3">
          When to Lazy Load
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-zinc-200 mb-2">
              ✓ Good Candidates
            </h4>
            <ul className="text-zinc-400 space-y-1">
              <li>• Routes/pages (automatic in Next.js)</li>
              <li>• Modals and dialogs</li>
              <li>• Charts and data visualizations</li>
              <li>• Admin panels</li>
              <li>• Heavy third-party components</li>
              <li>• Features behind feature flags</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-zinc-200 mb-2">
              ✗ Don't Lazy Load
            </h4>
            <ul className="text-zinc-400 space-y-1">
              <li>• Components in the critical path</li>
              <li>• Small, frequently-used components</li>
              <li>• Components needed immediately</li>
              <li>• Layout components</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Suspense Boundaries */}
      <div className="mt-8 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
        <h3 className="font-semibold text-amber-400 mb-3">
          Suspense Boundary Placement
        </h3>
        <div className="text-sm text-zinc-400 space-y-2">
          <p>
            <strong className="text-zinc-200">Too high:</strong> One Suspense at
            the root means the entire app shows a spinner while anything loads.
          </p>
          <p>
            <strong className="text-zinc-200">Too low:</strong> Many small
            spinners can create a "popcorn" effect - things loading at different
            times.
          </p>
          <p>
            <strong className="text-zinc-200">Just right:</strong> Place
            Suspense boundaries around logical sections that can load
            independently.
          </p>
        </div>
      </div>

      {/* Interview Points */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
        <h3 className="font-semibold text-zinc-100 mb-4">
          Interview Talking Points
        </h3>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: What's the difference between lazy() and dynamic()?
            </strong>
            <p className="mt-1">
              A: React.lazy() is React's built-in code splitting. Next.js
              dynamic() is a wrapper that adds SSR control and loading component
              options. In Next.js, prefer dynamic() for its extra features.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: How does Suspense work under the hood?
            </strong>
            <p className="mt-1">
              A: When a component "suspends" (throws a Promise), React catches
              it, shows the fallback, and re-renders when the Promise resolves.
              It's essentially try/catch for async loading.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: Can Suspense be used for data fetching?
            </strong>
            <p className="mt-1">
              A: Yes! In React 19, the use() hook integrates with Suspense for
              data fetching. Libraries like TanStack Query and SWR also support
              Suspense mode.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
