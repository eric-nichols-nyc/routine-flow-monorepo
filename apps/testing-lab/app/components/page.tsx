import { TestTube2, FileCode } from "lucide-react";
import { ComponentDemo } from "./component-demo";

export default function ComponentsPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
            <TestTube2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              Component Testing
            </h1>
            <p className="text-sm text-zinc-400">
              Test React components with Testing Library
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <ComponentDemo />

      {/* Code Examples */}
      <div className="mt-8 space-y-6">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-violet-400" />
            Basic Component Test
          </h3>
          <pre className="text-sm text-zinc-400 overflow-x-auto">
            <code>{`import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click</Button>);

    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});`}</code>
          </pre>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-violet-400" />
            Form Component Test
          </h3>
          <pre className="text-sm text-zinc-400 overflow-x-auto">
            <code>{`import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  it("submits with email and password", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(
      screen.getByLabelText(/email/i),
      "test@example.com"
    );
    await user.type(
      screen.getByLabelText(/password/i),
      "secret123"
    );
    await user.click(
      screen.getByRole("button", { name: /submit/i })
    );

    expect(handleSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "secret123",
    });
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();

    render(<LoginForm onSubmit={() => {}} />);

    await user.type(
      screen.getByLabelText(/email/i),
      "invalid-email"
    );
    await user.click(
      screen.getByRole("button", { name: /submit/i })
    );

    expect(
      screen.getByText(/invalid email/i)
    ).toBeInTheDocument();
  });
});`}</code>
          </pre>
        </div>

        <div className="p-6 rounded-2xl bg-violet-500/10 border border-violet-500/20">
          <h3 className="font-semibold text-violet-400 mb-3">
            Testing Library Queries
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-zinc-200 mb-2">Priority Order</h4>
              <ol className="text-zinc-400 space-y-1 list-decimal list-inside">
                <li>getByRole (accessibility)</li>
                <li>getByLabelText (forms)</li>
                <li>getByPlaceholderText</li>
                <li>getByText (content)</li>
                <li>getByTestId (fallback)</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-zinc-200 mb-2">Query Types</h4>
              <ul className="text-zinc-400 space-y-1">
                <li>
                  • <code className="text-violet-400">getBy</code> - throws if
                  not found
                </li>
                <li>
                  • <code className="text-violet-400">queryBy</code> - returns
                  null
                </li>
                <li>
                  • <code className="text-violet-400">findBy</code> - async,
                  waits
                </li>
                <li>
                  • <code className="text-violet-400">getAllBy</code> - multiple
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
