import { FlaskConical, FileCode } from "lucide-react";
import { HooksDemo } from "./hooks-demo";

export default function HooksPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              Custom Hooks Testing
            </h1>
            <p className="text-sm text-zinc-400">
              Test React hooks with renderHook and act
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <HooksDemo />

      {/* Test Examples */}
      <div className="mt-8 space-y-6">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-400" />
            useCounter Test Example
          </h3>
          <pre className="text-sm text-zinc-400 overflow-x-auto">
            <code>{`import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./use-counter";

describe("useCounter", () => {
  it("should increment by 1", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("should respect max bounds", () => {
    const { result } = renderHook(() =>
      useCounter({ initialValue: 9, max: 10 })
    );

    act(() => {
      result.current.increment();
      result.current.increment(); // Won't exceed 10
    });

    expect(result.current.count).toBe(10);
  });
});`}</code>
          </pre>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-400" />
            useFetch Test with MSW
          </h3>
          <pre className="text-sm text-zinc-400 overflow-x-auto">
            <code>{`import { renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "./use-fetch";

describe("useFetch", () => {
  it("should fetch data successfully", async () => {
    const { result } = renderHook(() =>
      useFetch<User[]>("/api/users")
    );

    // Initial loading state
    expect(result.current.isLoading).toBe(true);

    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(3);
    expect(result.current.error).toBeNull();
  });
});`}</code>
          </pre>
        </div>

        <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
          <h3 className="font-semibold text-green-400 mb-3">
            Key Testing Patterns
          </h3>
          <ul className="text-sm text-zinc-400 space-y-2">
            <li>
              • Use <code className="text-green-400">renderHook</code> to test
              hooks in isolation
            </li>
            <li>
              • Wrap state updates in{" "}
              <code className="text-green-400">act()</code>
            </li>
            <li>
              • Use <code className="text-green-400">waitFor</code> for async
              hooks
            </li>
            <li>
              • Access hook return value via{" "}
              <code className="text-green-400">result.current</code>
            </li>
            <li>
              • Test edge cases: min/max bounds, error states, empty values
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
