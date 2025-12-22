import { Shield } from "lucide-react";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { ReactMemoDemo } from "./react-memo-demo";

export default function ReactMemoPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">React.memo</h1>
            <p className="text-sm text-zinc-400">
              Prevent unnecessary re-renders with component memoization
            </p>
          </div>
        </div>
      </div>

      {/* React.memo Demo */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Live Demo: Memoized vs Non-Memoized
        </h2>
        <ReactMemoDemo />
      </div>

      {/* How It Works */}
      <Section title="How React.memo Works" icon={Shield} color="emerald">
        <div className="space-y-3 text-sm text-zinc-400">
          <p>
            <strong className="text-zinc-200">React.memo</strong> is a
            higher-order component that memoizes the rendered output. When a
            parent re-renders, React compares the new props to the old props.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              If props are the same (shallow comparison), skip re-rendering
            </li>
            <li>If props are different, re-render the component</li>
            <li>Only compares props, not internal state or context</li>
          </ul>
        </div>
      </Section>

      {/* Code Examples */}
      <div className="mt-8 space-y-6">
        <CodeBlock
          filename="basic-memo.tsx"
          code={`// Wrap a component with React.memo
const ExpensiveList = memo(function ExpensiveList({ items }) {
  return items.map(item => <ListItem key={item.id} {...item} />);
});

// Now ExpensiveList only re-renders if 'items' changes
<ExpensiveList items={items} />`}
        />

        <CodeBlock
          filename="custom-comparator.tsx"
          code={`// Custom comparison function for complex props
const UserCard = memo(
  function UserCard({ user, onSelect }) {
    return <div onClick={() => onSelect(user)}>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (should NOT re-render)
    return prevProps.user.id === nextProps.user.id;
  }
);`}
        />
      </div>

      {/* Common Pitfalls */}
      <div className="mt-8 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20">
        <h3 className="font-semibold text-rose-400 mb-3">Common Pitfalls</h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-zinc-200 font-medium">1. Object/Array Props</p>
            <p className="text-zinc-400 mt-1">
              Inline objects/arrays create new references every render, breaking
              memoization.
            </p>
            <div className="mt-2 font-mono text-xs">
              <p className="text-rose-400">
                ❌ style=&#123;&#123; color: 'red' &#125;&#125;
              </p>
              <p className="text-emerald-400">
                ✅ style=&#123;memoizedStyle&#125;
              </p>
            </div>
          </div>
          <div>
            <p className="text-zinc-200 font-medium">2. Function Props</p>
            <p className="text-zinc-400 mt-1">
              Inline functions also create new references. Use useCallback.
            </p>
            <div className="mt-2 font-mono text-xs">
              <p className="text-rose-400">
                ❌ onClick=&#123;() =&gt; handle(id)&#125;
              </p>
              <p className="text-emerald-400">
                ✅ onClick=&#123;memoizedHandler&#125;
              </p>
            </div>
          </div>
          <div>
            <p className="text-zinc-200 font-medium">3. Children Prop</p>
            <p className="text-zinc-400 mt-1">
              JSX children are objects too! Consider composition patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Interview Points */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
        <h3 className="font-semibold text-zinc-100 mb-4">
          Interview Talking Points
        </h3>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: When should you use React.memo?
            </strong>
            <p className="mt-1">
              A: When a component renders often with the same props, when it's
              expensive to render, or when it's in a frequently-updating parent.
              Always measure first!
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: What does "shallow comparison" mean?
            </strong>
            <p className="mt-1">
              A: React compares props using Object.is() for each prop. For
              objects/arrays, it only checks if the reference is the same, not
              the contents.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: How does memo interact with Context?
            </strong>
            <p className="mt-1">
              A: React.memo doesn't prevent re-renders from context changes. If
              a context value changes, all consumers will re-render regardless
              of memoization.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
