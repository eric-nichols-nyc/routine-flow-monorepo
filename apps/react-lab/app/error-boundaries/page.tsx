import { AlertTriangle } from "lucide-react";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { ErrorBoundaryDemo } from "./error-boundary-demo";

export default function ErrorBoundariesPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              Error Boundaries
            </h1>
            <p className="text-sm text-zinc-400">
              Graceful error handling with fallback UIs
            </p>
          </div>
        </div>
      </div>

      {/* Demo */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Live Demo: Error Containment
        </h2>
        <ErrorBoundaryDemo />
      </div>

      {/* What They Catch */}
      <Section
        title="What Error Boundaries Catch"
        icon={AlertTriangle}
        color="amber"
      >
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-emerald-400 mb-2">✓ Catches</h4>
            <ul className="text-zinc-400 space-y-1">
              <li>• Errors during rendering</li>
              <li>• Errors in lifecycle methods</li>
              <li>• Errors in constructors</li>
              <li>• Errors in child components</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-rose-400 mb-2">✗ Does NOT Catch</h4>
            <ul className="text-zinc-400 space-y-1">
              <li>• Event handlers (use try/catch)</li>
              <li>• Async code (promises, setTimeout)</li>
              <li>• Server-side rendering</li>
              <li>• Errors in the boundary itself</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Code Example */}
      <div className="mt-8">
        <CodeBlock
          filename="error-boundary.tsx"
          code={`'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorFallback />}>
  <RiskyComponent />
</ErrorBoundary>`}
        />
      </div>

      {/* React 19 use() Pattern */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">
          React 19: Error Boundaries + Suspense
        </h3>
        <CodeBlock
          filename="modern-error-handling.tsx"
          code={`// React 19 pattern with use() hook
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function UserProfile({ userId }) {
  // use() can throw promises and errors
  const user = use(fetchUser(userId));
  return <div>{user.name}</div>;
}

// Compose Suspense and ErrorBoundary
<ErrorBoundary fallback={<ErrorUI />}>
  <Suspense fallback={<Loading />}>
    <UserProfile userId={123} />
  </Suspense>
</ErrorBoundary>`}
        />
      </div>

      {/* Best Practices */}
      <div className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
        <h3 className="font-semibold text-emerald-400 mb-3">Best Practices</h3>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">Place strategically:</strong> Wrap
            route segments, major features, or widgets that could fail
            independently.
          </li>
          <li>
            <strong className="text-zinc-200">Provide recovery options:</strong>{" "}
            Include "Try Again" buttons that reset error state.
          </li>
          <li>
            <strong className="text-zinc-200">Log errors:</strong> Send errors
            to monitoring services (Sentry, DataDog) in componentDidCatch.
          </li>
          <li>
            <strong className="text-zinc-200">Use react-error-boundary:</strong>{" "}
            Library with hooks API, reset keys, and onError callbacks.
          </li>
        </ul>
      </div>

      {/* Interview Points */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
        <h3 className="font-semibold text-zinc-100 mb-4">
          Interview Talking Points
        </h3>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>
            <strong className="text-zinc-200">
              Q: Why can't you use hooks for error boundaries?
            </strong>
            <p className="mt-1">
              A: Error boundaries require the componentDidCatch and
              getDerivedStateFromError lifecycle methods, which don't have hook
              equivalents. This is one of the few remaining use cases for class
              components.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: How do you handle errors in event handlers?
            </strong>
            <p className="mt-1">
              A: Use try/catch inside the handler, or wrap async handlers with
              error handling. Error boundaries only catch errors during
              rendering.
            </p>
          </li>
          <li>
            <strong className="text-zinc-200">
              Q: What's the react-error-boundary library?
            </strong>
            <p className="mt-1">
              A: A popular library that provides ErrorBoundary as a component
              with hooks like useErrorBoundary, reset functionality, and onError
              callbacks.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
