import { Globe, FileCode, Terminal } from "lucide-react";

export default function E2EPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              E2E Testing with Playwright
            </h1>
            <p className="text-sm text-zinc-400">
              Test full user flows across browsers
            </p>
          </div>
        </div>
      </div>

      {/* Commands */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20 mb-8">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-rose-400" />
          Run E2E Tests
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-zinc-900/50">
            <code className="text-rose-400 text-sm">pnpm test:e2e</code>
            <p className="text-xs text-zinc-500 mt-1">Run headless</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900/50">
            <code className="text-rose-400 text-sm">pnpm test:e2e:ui</code>
            <p className="text-xs text-zinc-500 mt-1">Playwright UI mode</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900/50">
            <code className="text-rose-400 text-sm">pnpm test:e2e:headed</code>
            <p className="text-xs text-zinc-500 mt-1">See the browser</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900/50">
            <code className="text-rose-400 text-sm">
              npx playwright codegen
            </code>
            <p className="text-xs text-zinc-500 mt-1">Record tests</p>
          </div>
        </div>
      </div>

      {/* Test Examples */}
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-rose-400" />
            Navigation Test
          </h3>
          <pre className="text-sm text-zinc-400 overflow-x-auto">
            <code>{`// e2e/navigation.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate to hooks page", async ({ page }) => {
    await page.goto("/");

    // Click the hooks link
    await page.click('text=Custom Hooks');

    // Verify URL changed
    await expect(page).toHaveURL("/hooks");

    // Verify page content
    await expect(
      page.getByRole("heading", { name: "Custom Hooks Testing" })
    ).toBeVisible();
  });
});`}</code>
          </pre>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-rose-400" />
            Counter Interaction Test
          </h3>
          <pre className="text-sm text-zinc-400 overflow-x-auto">
            <code>{`// e2e/counter.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Counter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/hooks");
  });

  test("should increment counter", async ({ page }) => {
    const counter = page.getByTestId("counter-value");
    const incrementBtn = page.getByRole("button", { name: "Increment" });

    await expect(counter).toHaveText("0");

    await incrementBtn.click();
    await expect(counter).toHaveText("1");

    await incrementBtn.click();
    await incrementBtn.click();
    await expect(counter).toHaveText("3");
  });

  test("should respect max bound", async ({ page }) => {
    const counter = page.getByTestId("counter-value");
    const incrementBtn = page.getByRole("button", { name: "Increment" });

    // Click 15 times, but max is 10
    for (let i = 0; i < 15; i++) {
      await incrementBtn.click();
    }

    await expect(counter).toHaveText("10");
  });
});`}</code>
          </pre>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-rose-400" />
            Form Test
          </h3>
          <pre className="text-sm text-zinc-400 overflow-x-auto">
            <code>{`// e2e/form.spec.ts
import { test, expect } from "@playwright/test";

test.describe("LocalStorage Demo", () => {
  test("should add items to list", async ({ page }) => {
    await page.goto("/hooks");

    const input = page.getByTestId("storage-input");
    const items = page.getByTestId("storage-items");

    // Add first item
    await input.fill("First item");
    await input.press("Enter");

    // Add second item
    await input.fill("Second item");
    await page.click('text=Add');

    // Verify items are in the list
    await expect(items).toContainText("First item");
    await expect(items).toContainText("Second item");
  });
});`}</code>
          </pre>
        </div>

        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <h3 className="font-semibold text-rose-400 mb-3">
            Playwright Best Practices
          </h3>
          <ul className="text-sm text-zinc-400 space-y-2">
            <li>
              • Use <code className="text-rose-400">data-testid</code> for
              stable selectors
            </li>
            <li>
              • Prefer <code className="text-rose-400">getByRole</code> for
              accessibility
            </li>
            <li>
              • Use <code className="text-rose-400">test.beforeEach</code> for
              common setup
            </li>
            <li>
              • Take screenshots on failure with{" "}
              <code className="text-rose-400">
                screenshot: 'only-on-failure'
              </code>
            </li>
            <li>• Use Playwright's built-in assertions - they auto-retry</li>
            <li>• Test across multiple browsers in CI</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
