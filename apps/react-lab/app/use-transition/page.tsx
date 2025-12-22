import { Clock } from "lucide-react";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { UseTransitionDemo } from "./use-transition-demo";
import { UseDeferredValueDemo } from "./use-deferred-value-demo";

export default function UseTransitionPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              useTransition & useDeferredValue
            </h1>
            <p className="text-sm text-zinc-400">
              React 18+ concurrent features for responsive UIs
            </p>
          </div>
        </div>
      </div>

      {/* useTransition Demo */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          useTransition: Non-Blocking State Updates
        </h2>
        <UseTransitionDemo />
      </div>

      {/* useDeferredValue Demo */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          useDeferredValue: Defer Expensive Rendering
        </h2>
        <UseDeferredValueDemo />
      </div>

      {/* Comparison */}
      <Section title="When to Use Which?" icon={Clock} color="violet">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-violet-400 mb-2">useTransition</h4>
            <ul className="text-zinc-400 space-y-1">
              <li>• You control the state update</li>
              <li>• Want to show pending state</li>
              <li>• Wrapping setState calls</li>
              <li>• Tab switching, navigation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-cyan-400 mb-2">useDeferredValue</h4>
            <ul className="text-zinc-400 space-y-1">
              <li>• Value comes from props/context</li>
              <li>• You don't control the source</li>
              <li>• Deferring render of value</li>
              <li>• Search results, filtered lists</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Code Examples */}
      <div className="mt-8 space-y-6">
        <CodeBlock
          filename="useTransition-example.tsx"
          code={`const [isPending, startTransition] = useTransition();

function handleTabChange(tab: string) {
  // Urgent: Update the tab indicator immediately
  setActiveTab(tab);

  // Non-urgent: Load tab content with lower priority
  startTransition(() => {
    setTabContent(loadContent(tab));
  });
}

// Show loading indicator while transition is pending
{isPending && <Spinner />}`}
        />

        <CodeBlock
          filename="useDeferredValue-example.tsx"
          code={`function SearchResults({ query }: { query: string }) {
  // Create a deferred version of the query
  const deferredQuery = useDeferredValue(query);

  // Expensive filtering uses deferred value
  const results = useMemo(
    () => items.filter(item => item.includes(deferredQuery)),
    [deferredQuery]
  );

  // Show stale indicator while deferring
  const isStale = query !== deferredQuery;

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      {results.map(r => <Result key={r} />)}
    </div>
  );
}`}
        />
      </div>

      {/* Interview Points */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20">
        <h3 className="font-semibold text-zinc-100 mb-4">
          Interview Talking Points
        </h3>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: What is Concurrent React?
            </strong>
            <p className="mt-1">
              A: A set of features that let React interrupt, pause, and resume
              rendering work. It enables non-blocking updates and prioritization
              of urgent work over less important updates.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: How does useTransition improve UX?
            </strong>
            <p className="mt-1">
              A: It keeps the UI responsive during expensive updates by marking
              them as non-urgent. The user can keep interacting while React
              works on the transition in the background.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: What's "time slicing" in React?
            </strong>
            <p className="mt-1">
              A: React breaks rendering work into small chunks and yields to the
              browser between chunks. This prevents the main thread from being
              blocked by long renders.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
