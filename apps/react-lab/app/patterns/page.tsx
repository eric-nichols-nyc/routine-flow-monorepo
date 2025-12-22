import { Sparkles } from "lucide-react";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";

export default function PatternsPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              Advanced Patterns
            </h1>
            <p className="text-sm text-zinc-400">
              Compound components, render props, and composition patterns
            </p>
          </div>
        </div>
      </div>

      {/* Compound Components */}
      <div className="mb-8">
        <Section title="Compound Components" icon={Sparkles} color="pink">
          <p className="text-sm text-zinc-400 mb-4">
            Components that work together to form a complete UI, sharing
            implicit state. Think of HTML's{" "}
            <code className="text-pink-400">&lt;select&gt;</code> and{" "}
            <code className="text-pink-400">&lt;option&gt;</code>.
          </p>
          <CodeBlock
            filename="compound-components.tsx"
            code={`// Usage - clean, declarative API
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Account</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Settings</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Account content</Tabs.Content>
  <Tabs.Content value="tab2">Settings content</Tabs.Content>
</Tabs>

// Implementation
const TabsContext = createContext<TabsState | null>(null);

function Tabs({ children, defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      {children}
    </TabsContext.Provider>
  );
}

Tabs.Trigger = function Trigger({ value, children }) {
  const ctx = useContext(TabsContext);
  return (
    <button onClick={() => ctx.setValue(value)}>
      {children}
    </button>
  );
};`}
          />
        </Section>
      </div>

      {/* Render Props */}
      <div className="mb-8">
        <Section title="Render Props" icon={Sparkles} color="violet">
          <p className="text-sm text-zinc-400 mb-4">
            A function prop that returns React elements, allowing flexible
            rendering control. Mostly replaced by hooks, but still useful for
            some patterns.
          </p>
          <CodeBlock
            filename="render-props.tsx"
            code={`// Component with render prop
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return render(position);
}

// Usage - you control the output
<MouseTracker
  render={({ x, y }) => (
    <div>Mouse at: {x}, {y}</div>
  )}
/>

// Alternative: "children as function"
<MouseTracker>
  {({ x, y }) => <div>Mouse at: {x}, {y}</div>}
</MouseTracker>`}
          />
        </Section>
      </div>

      {/* Custom Hooks */}
      <div className="mb-8">
        <Section
          title="Custom Hooks (Modern Alternative)"
          icon={Sparkles}
          color="emerald"
        >
          <p className="text-sm text-zinc-400 mb-4">
            The modern way to share stateful logic. Replaced most render props
            patterns.
          </p>
          <CodeBlock
            filename="custom-hooks.tsx"
            code={`// Custom hook encapsulates logic
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return position;
}

// Usage - much cleaner!
function MyComponent() {
  const { x, y } = useMousePosition();
  return <div>Mouse at: {x}, {y}</div>;
}

// Can reuse anywhere
function AnotherComponent() {
  const pos = useMousePosition();
  return <Cursor position={pos} />;
}`}
          />
        </Section>
      </div>

      {/* HOCs */}
      <div className="mb-8">
        <Section
          title="Higher-Order Components (HOCs)"
          icon={Sparkles}
          color="amber"
        >
          <p className="text-sm text-zinc-400 mb-4">
            Functions that take a component and return an enhanced component.
            Less common now but still used in some libraries.
          </p>
          <CodeBlock
            filename="hoc.tsx"
            code={`// HOC that adds logging
function withLogging<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function WithLogging(props: P) {
    useEffect(() => {
      console.log('Component mounted:', WrappedComponent.name);
      return () => console.log('Component unmounted');
    }, []);

    return <WrappedComponent {...props} />;
  };
}

// Usage
const LoggedButton = withLogging(Button);
<LoggedButton onClick={handleClick}>Click</LoggedButton>

// Common HOC patterns:
// - withAuth (protect routes)
// - withTheme (inject theme)
// - connect (Redux)
// - memo (React's built-in HOC)`}
          />
        </Section>
      </div>

      {/* Controlled vs Uncontrolled */}
      <div className="mb-8">
        <Section
          title="Controlled vs Uncontrolled"
          icon={Sparkles}
          color="cyan"
        >
          <p className="text-sm text-zinc-400 mb-4">
            Choose based on who owns the state: the component or the parent.
          </p>
          <CodeBlock
            filename="controlled-vs-uncontrolled.tsx"
            code={`// UNCONTROLLED - Component owns state
function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    console.log(inputRef.current?.value);
  };

  return <input ref={inputRef} defaultValue="initial" />;
}

// CONTROLLED - Parent owns state
function ControlledInput({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}

// Usage
const [name, setName] = useState('');
<ControlledInput value={name} onChange={setName} />

// FLEXIBLE - Support both (like good UI libraries)
function FlexibleInput({ value, defaultValue, onChange }) {
  const [internal, setInternal] = useState(defaultValue ?? '');
  const isControlled = value !== undefined;

  const currentValue = isControlled ? value : internal;
  const handleChange = (newValue) => {
    if (!isControlled) setInternal(newValue);
    onChange?.(newValue);
  };

  return <input value={currentValue} onChange={e => handleChange(e.target.value)} />;
}`}
          />
        </Section>
      </div>

      {/* Interview Points */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20">
        <h3 className="font-semibold text-zinc-100 mb-4">
          Interview Talking Points
        </h3>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: When would you use compound components?
            </strong>
            <p className="mt-1">
              A: For complex components with multiple related parts that share
              state (Tabs, Accordion, Dropdown). It provides a clean, flexible
              API while keeping internal state manageable.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: Hooks vs Render Props vs HOCs?
            </strong>
            <p className="mt-1">
              A: Hooks are the modern default - cleaner, more reusable. Render
              props when you need rendering control. HOCs are rare now but
              appear in legacy code and some libraries.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: When would you use an uncontrolled component?
            </strong>
            <p className="mt-1">
              A: For simple forms where you only need the value on submit, or
              for integrating with non-React libraries that manage their own DOM
              state.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
