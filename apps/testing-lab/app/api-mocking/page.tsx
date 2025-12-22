import { Webhook, FileCode } from "lucide-react";
import { ApiMockingDemo } from "./api-mocking-demo";

export default function ApiMockingPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Webhook className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              API Mocking with MSW
            </h1>
            <p className="text-sm text-zinc-400">
              Mock API calls for reliable, fast tests
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <ApiMockingDemo />

      {/* Code Examples */}
      <div className="mt-8 space-y-6">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            MSW Handler Setup
          </h3>
          <pre className="text-sm text-zinc-400 overflow-x-auto">
            <code>{`// mocks/handlers.ts
import { http, HttpResponse, delay } from "msw";

export const handlers = [
  http.get("/api/users", async () => {
    await delay(100); // Simulate network latency
    return HttpResponse.json([
      { id: 1, name: "John", email: "john@example.com" },
      { id: 2, name: "Jane", email: "jane@example.com" },
    ]);
  }),

  http.post("/api/users", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { id: 3, ...body },
      { status: 201 }
    );
  }),

  http.get("/api/error", () => {
    return HttpResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }),
];`}</code>
          </pre>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            Override Handlers in Tests
          </h3>
          <pre className="text-sm text-zinc-400 overflow-x-auto">
            <code>{`import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";

describe("API tests", () => {
  it("handles custom response for this test only", async () => {
    // Override the default handler
    server.use(
      http.get("/api/users", () => {
        return HttpResponse.json([
          { id: 99, name: "Test User" }
        ]);
      })
    );

    // This test gets the overridden response
    const { result } = renderHook(() =>
      useFetch("/api/users")
    );

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });
  });
});`}</code>
          </pre>
        </div>

        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <h3 className="font-semibold text-amber-400 mb-3">Why MSW?</h3>
          <ul className="text-sm text-zinc-400 space-y-2">
            <li>
              • <strong>Network level mocking</strong> - intercepts actual
              fetch/XHR requests
            </li>
            <li>
              • <strong>Same handlers for tests & dev</strong> - mock APIs
              before backend is ready
            </li>
            <li>
              • <strong>Type-safe</strong> - full TypeScript support
            </li>
            <li>
              • <strong>Realistic</strong> - simulates delays, errors, edge
              cases
            </li>
            <li>
              • <strong>Clean tests</strong> - no spying on fetch or axios
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
