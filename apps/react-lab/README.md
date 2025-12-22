# React Lab

Interactive demos for learning React concepts and optimization strategies.

## Getting Started

```bash
pnpm dev
```

Then open [http://localhost:3008](http://localhost:3008).

## Bundle Analysis

Analyze your bundle size with:

```bash
pnpm build:analyze
```

This opens an interactive treemap visualization showing:

- What's in your client and server bundles
- Size of each module (parsed and gzipped)
- Which dependencies are largest
- Opportunities for code splitting

## Features

- **Visual Render Tracking** - Yellow flash indicates component re-renders
- **Interactive Demos** - Hands-on examples for each concept
- **Code Examples** - Copy-paste ready code snippets
- **Interview Prep** - Common interview questions with answers

## Topics Covered

### State Management

- `useState` - Simple local state
- `useReducer` - Complex state logic
- Automatic batching (React 18+)
- Functional updates

### Memoization

- `useMemo` - Cache expensive calculations
- `useCallback` - Stable function references
- When to use (and when NOT to)

### Component Optimization

- `React.memo` - Prevent unnecessary re-renders
- Common pitfalls (inline objects, functions)
- Custom comparison functions

### Concurrent React

- `useTransition` - Non-blocking state updates
- `useDeferredValue` - Defer expensive rendering
- Pending states and time slicing

### Context Performance

- The re-render problem
- Context splitting
- Memoized providers
- State vs dispatch separation

### List Optimization

- Keys and reconciliation
- Index vs ID keys (with live bug demo)
- Virtualization / windowing
- When to virtualize

### Error Handling

- Error Boundaries
- What they catch (and don't)
- Recovery patterns
- React 19 Suspense integration

### Advanced Patterns

- Compound components
- Render props
- Custom hooks
- Controlled vs uncontrolled
- Higher-order components (HOCs)

## Tech Stack

- React 19
- Next.js 16
- TypeScript
- Tailwind CSS 4
- Lucide React icons

## Project Structure

```
app/
├── page.tsx              # Home with concept overview
├── use-state/            # useState & useReducer demos
├── use-memo/             # useMemo & useCallback demos
├── react-memo/           # React.memo demos
├── use-transition/       # Concurrent features demos
├── context/              # Context performance demos
├── lists/                # List optimization demos
├── error-boundaries/     # Error boundary demos
└── patterns/             # Advanced patterns
components/
├── render-tracker.tsx    # Visual re-render indicator
├── code-block.tsx        # Syntax highlighted code
└── section.tsx           # Styled section wrapper
```

## Optimization Mental Model

1. **Reduce Renders** - React.memo, move state down, lift content up
2. **Make Renders Cheap** - useMemo, virtualization, lazy loading
3. **Defer Work** - useTransition, useDeferredValue, Suspense

## Important Notes

- Don't optimize prematurely - React is fast by default
- Always measure with React DevTools Profiler before adding useMemo/useCallback
- Memoization has overhead - it's not free
- Most apps don't need aggressive optimization
