import { Layers } from "lucide-react";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { ContextDemo } from "./context-demo";

export default function ContextPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              Context Performance
            </h1>
            <p className="text-sm text-zinc-400">
              Avoid the context re-render trap with proper patterns
            </p>
          </div>
        </div>
      </div>

      {/* Context Demo */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Live Demo: Context Re-render Problem
        </h2>
        <ContextDemo />
      </div>

      {/* The Problem */}
      <Section title="The Problem" icon={Layers} color="rose">
        <p className="text-sm text-zinc-400 mb-4">
          When a context value changes,{" "}
          <strong className="text-zinc-200">ALL consumers re-render</strong>,
          even if they only use a part of the value that didn't change.
        </p>
        <div className="p-4 rounded-lg bg-zinc-800/50 font-mono text-sm">
          <p className="text-rose-400">// Bad: One context with everything</p>
          <p className="text-zinc-300">
            const value = &#123; user, theme, settings &#125;
          </p>
          <p className="text-zinc-500 mt-2">
            // Changing theme re-renders user components too!
          </p>
        </div>
      </Section>

      {/* Solutions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Solution 1: Split Contexts" color="emerald">
          <p className="text-sm text-zinc-400 mb-3">
            Separate contexts for unrelated data.
          </p>
          <CodeBlock
            code={`// Separate concerns
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>
    <App />
  </ThemeContext.Provider>
</UserContext.Provider>`}
          />
        </Section>

        <Section title="Solution 2: Memoize Values" color="amber">
          <p className="text-sm text-zinc-400 mb-3">
            Prevent new object references with useMemo.
          </p>
          <CodeBlock
            code={`const value = useMemo(
  () => ({ user, actions }),
  [user] // Only recreate when user changes
);

<UserContext.Provider value={value}>
  ...
</UserContext.Provider>`}
          />
        </Section>

        <Section title="Solution 3: State + Dispatch Split" color="violet">
          <p className="text-sm text-zinc-400 mb-3">
            Separate read (state) from write (dispatch).
          </p>
          <CodeBlock
            code={`// Components that only dispatch don't
// re-render when state changes!
<StateContext.Provider value={state}>
  <DispatchContext.Provider value={dispatch}>
    ...
  </DispatchContext.Provider>
</StateContext.Provider>`}
          />
        </Section>

        <Section title="Solution 4: Selector Pattern" color="cyan">
          <p className="text-sm text-zinc-400 mb-3">
            Use a store library with selectors (Zustand, Jotai).
          </p>
          <CodeBlock
            code={`// Only re-renders when selected value changes
const user = useStore(state => state.user);
const theme = useStore(state => state.theme);

// Or use use-context-selector library
const name = useContextSelector(
  UserContext,
  ctx => ctx.user.name
);`}
          />
        </Section>
      </div>

      {/* Interview Points */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20">
        <h3 className="font-semibold text-zinc-100 mb-4">
          Interview Talking Points
        </h3>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: Why doesn't React.memo work with Context?
            </strong>
            <p className="mt-1">
              A: React.memo only prevents re-renders from prop changes. Context
              changes bypass memo entirely because they're not props - they're a
              separate subscription mechanism.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: When should you use Context vs a state library?
            </strong>
            <p className="mt-1">
              A: Context is great for low-frequency updates (theme, auth). For
              high-frequency updates (forms, real-time data), consider Zustand
              or Jotai which have built-in selector support.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: How does Zustand avoid the context re-render problem?
            </strong>
            <p className="mt-1">
              A: Zustand uses subscriptions with selectors. Components only
              re-render when their specific selected slice of state changes, not
              when any part of the store changes.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
