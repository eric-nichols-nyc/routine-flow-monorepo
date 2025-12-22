import { HardDrive, FileCode } from "lucide-react";

export default function AsyncPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Async Testing</h1>
            <p className="text-sm text-zinc-400">
              Handle async operations in tests
            </p>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            waitFor - Wait for Condition
          </h3>
          <pre className="text-sm text-zinc-400 overflow-x-auto">
            <code>{`import { render, screen, waitFor } from "@testing-library/react";
import { DataLoader } from "./data-loader";

it("loads and displays data", async () => {
  render(<DataLoader />);

  // Immediately shows loading
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for data to appear
  await waitFor(() => {
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  // Loading should be gone
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});`}</code>
          </pre>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            findBy - Async Query
          </h3>
          <pre className="text-sm text-zinc-400 overflow-x-auto">
            <code>{`import { render, screen } from "@testing-library/react";
import { AsyncComponent } from "./async-component";

it("finds element after async load", async () => {
  render(<AsyncComponent />);

  // findBy returns a promise - waits automatically
  const element = await screen.findByText("Loaded!");

  expect(element).toBeInTheDocument();
});

it("times out if element never appears", async () => {
  render(<AsyncComponent willFail />);

  // This will throw after timeout (default 1000ms)
  await expect(
    screen.findByText("This won't appear")
  ).rejects.toThrow();
});`}</code>
          </pre>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            Testing Loading States
          </h3>
          <pre className="text-sm text-zinc-400 overflow-x-auto">
            <code>{`import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";

it("shows loading then content", async () => {
  render(<DataFetcher />);

  // Loading spinner should appear
  const spinner = screen.getByRole("status");
  expect(spinner).toBeInTheDocument();

  // Wait for spinner to disappear
  await waitForElementToBeRemoved(spinner);

  // Content should now be visible
  expect(screen.getByRole("list")).toBeInTheDocument();
});`}</code>
          </pre>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            Fake Timers
          </h3>
          <pre className="text-sm text-zinc-400 overflow-x-auto">
            <code>{`import { vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Countdown } from "./countdown";

it("counts down every second", async () => {
  vi.useFakeTimers();

  render(<Countdown seconds={3} />);
  expect(screen.getByText("3")).toBeInTheDocument();

  // Advance time by 1 second
  await act(async () => {
    vi.advanceTimersByTime(1000);
  });
  expect(screen.getByText("2")).toBeInTheDocument();

  // Fast-forward to end
  await act(async () => {
    vi.advanceTimersByTime(2000);
  });
  expect(screen.getByText("Done!")).toBeInTheDocument();

  vi.useRealTimers();
});`}</code>
          </pre>
        </div>

        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <h3 className="font-semibold text-emerald-400 mb-3">
            Async Testing Tips
          </h3>
          <ul className="text-sm text-zinc-400 space-y-2">
            <li>
              • Prefer <code className="text-emerald-400">findBy</code> over{" "}
              <code className="text-emerald-400">waitFor</code> +{" "}
              <code className="text-emerald-400">getBy</code>
            </li>
            <li>
              • Use{" "}
              <code className="text-emerald-400">
                waitForElementToBeRemoved
              </code>{" "}
              for loading spinners
            </li>
            <li>
              • Set custom timeouts:{" "}
              <code className="text-emerald-400">
                {'findByText("...", {}, { timeout: 3000 })'}
              </code>
            </li>
            <li>
              • Use <code className="text-emerald-400">vi.useFakeTimers()</code>{" "}
              for debounce/throttle
            </li>
            <li>
              • Always <code className="text-emerald-400">await</code> async
              queries and actions
            </li>
            <li>
              • Use <code className="text-emerald-400">act()</code> when
              updating state outside React events
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
