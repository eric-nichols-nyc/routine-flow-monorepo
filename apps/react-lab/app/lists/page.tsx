import { List } from "lucide-react";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { KeysDemo } from "./keys-demo";
import { VirtualizationDemo } from "./virtualization-demo";

export default function ListsPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <List className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              List Optimization
            </h1>
            <p className="text-sm text-zinc-400">
              Keys, virtualization, and efficient list rendering
            </p>
          </div>
        </div>
      </div>

      {/* Keys Demo */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Keys: Why They Matter
        </h2>
        <KeysDemo />
      </div>

      {/* Virtualization Demo */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Virtualization: Render Only What's Visible
        </h2>
        <VirtualizationDemo />
      </div>

      {/* Key Rules */}
      <Section title="Key Rules" icon={List} color="cyan">
        <div className="space-y-3 text-sm text-zinc-400">
          <div className="flex gap-3">
            <span className="text-emerald-400">✓</span>
            <div>
              <p className="text-zinc-200">
                Use stable, unique IDs from your data
              </p>
              <code className="text-xs text-cyan-400">
                key=&#123;item.id&#125;
              </code>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-rose-400">✗</span>
            <div>
              <p className="text-zinc-200">
                Don't use array index for dynamic lists
              </p>
              <code className="text-xs text-rose-400">
                key=&#123;index&#125;
              </code>
              <p className="text-xs text-zinc-500 mt-1">
                OK for static lists that never reorder
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-rose-400">✗</span>
            <div>
              <p className="text-zinc-200">Don't use random values</p>
              <code className="text-xs text-rose-400">
                key=&#123;Math.random()&#125;
              </code>
            </div>
          </div>
        </div>
      </Section>

      {/* Code Examples */}
      <div className="mt-8 space-y-6">
        <CodeBlock
          filename="virtualization-example.tsx"
          code={`import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Item height
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: virtualRow.start,
              height: virtualRow.size,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}`}
        />
      </div>

      {/* When to Virtualize */}
      <div className="mt-8 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
        <h3 className="font-semibold text-amber-400 mb-3">
          When to Virtualize?
        </h3>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">100+ items:</strong> Consider
            virtualization
          </li>
          <li>
            <strong className="text-zinc-200">1000+ items:</strong> Definitely
            virtualize
          </li>
          <li>
            <strong className="text-zinc-200">Complex items:</strong> Even
            smaller lists benefit if each item is expensive to render
          </li>
          <li>
            <strong className="text-zinc-200">Mobile:</strong> Lower threshold
            due to device constraints
          </li>
        </ul>
      </div>

      {/* Interview Points */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
        <h3 className="font-semibold text-zinc-100 mb-4">
          Interview Talking Points
        </h3>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: Why can't React figure out keys automatically?
            </strong>
            <p className="mt-1">
              A: React can't know what makes items unique in your data model.
              Array indices don't work because they change when items are added,
              removed, or reordered.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: What's windowing/virtualization?
            </strong>
            <p className="mt-1">
              A: Only rendering items currently visible in the viewport. Instead
              of 10,000 DOM nodes, you might have only 20-30 at any time. The
              rest are rendered on-demand during scroll.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: What libraries do you use for virtualization?
            </strong>
            <p className="mt-1">
              A: TanStack Virtual (formerly react-virtual) for most cases.
              react-window is also popular. For complex grids, AG Grid or
              react-virtuoso.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
