import { Variable } from "lucide-react";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { UseStateDemo } from "./use-state-demo";
import { UseReducerDemo } from "./use-reducer-demo";
import { BatchingDemo } from "./batching-demo";

export default function UseStatePage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Variable className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              useState & useReducer
            </h1>
            <p className="text-sm text-zinc-400">
              State management fundamentals in React
            </p>
          </div>
        </div>
      </div>

      {/* useState Demo */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          useState: Simple State
        </h2>
        <UseStateDemo />
      </div>

      {/* useReducer Demo */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          useReducer: Complex State
        </h2>
        <UseReducerDemo />
      </div>

      {/* Batching Demo */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Automatic Batching (React 18+)
        </h2>
        <BatchingDemo />
      </div>

      {/* When to Use Which */}
      <Section title="When to Use Which?" icon={Variable} color="blue">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-400 mb-2">useState</h4>
            <ul className="text-zinc-400 space-y-1">
              <li>• Simple, independent values</li>
              <li>• Boolean toggles</li>
              <li>• Form inputs</li>
              <li>• Counters</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-emerald-400 mb-2">useReducer</h4>
            <ul className="text-zinc-400 space-y-1">
              <li>• Complex state objects</li>
              <li>• State depends on previous state</li>
              <li>• Multiple sub-values</li>
              <li>• Shared logic between actions</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Code Examples */}
      <div className="mt-8 space-y-6">
        <CodeBlock
          filename="useState-example.tsx"
          code={`// Simple state
const [count, setCount] = useState(0);

// Functional update (when new state depends on old)
setCount(prev => prev + 1);

// Object state (always spread!)
const [form, setForm] = useState({ name: '', email: '' });
setForm(prev => ({ ...prev, name: 'John' }));`}
        />

        <CodeBlock
          filename="useReducer-example.tsx"
          code={`type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset'; payload: number };

function reducer(state: number, action: Action) {
  switch (action.type) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    case 'reset': return action.payload;
  }
}

const [count, dispatch] = useReducer(reducer, 0);
dispatch({ type: 'increment' });`}
        />
      </div>

      {/* Interview Points */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
        <h3 className="font-semibold text-zinc-100 mb-4">
          Interview Talking Points
        </h3>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: When would you choose useReducer over useState?
            </strong>
            <p className="mt-1">
              A: When state logic is complex, when next state depends on
              previous state, or when you have multiple sub-values that update
              together.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: What is state batching?
            </strong>
            <p className="mt-1">
              A: React groups multiple state updates into a single re-render for
              performance. In React 18+, this works everywhere including
              promises, timeouts, and event handlers.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: Why use functional updates?
            </strong>
            <p className="mt-1">
              A: When the new state depends on the previous state. It ensures
              you're working with the latest value, especially important with
              closures in async code.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
