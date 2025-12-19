# Testing Guide

This guide covers the testing strategy and tooling for the application.

## Overview

We use a layered testing approach:

| Layer          | Tool       | Purpose                                          |
| -------------- | ---------- | ------------------------------------------------ |
| **Unit Tests** | Vitest     | Test individual functions, validation, utilities |
| **E2E Tests**  | Playwright | Test complete user flows in real browser         |
| **Git Hooks**  | Husky      | Enforce tests before commit/push                 |

---

## Quick Start

### Run All Tests

```bash
# From monorepo root
pnpm --filter with-supabase test        # E2E tests (Playwright)
pnpm --filter with-supabase test:unit   # Unit tests (Vitest)

# From app directory
cd apps/with-supabase
pnpm test        # E2E
pnpm test:unit   # Unit
```

### Watch Mode (During Development)

```bash
# Unit tests with hot reload
pnpm --filter with-supabase test:unit
```

### Interactive UI

```bash
# Vitest UI
pnpm --filter with-supabase test:unit:ui

# Playwright UI
pnpm --filter with-supabase test:ui
```

---

## Unit Tests (Vitest)

### File Structure

```
with-supabase/
├── __tests__/
│   └── auth-validation.test.ts    # Unit tests
├── vitest.config.ts               # Vitest config
```

### Configuration

```typescript
// vitest.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/e2e/**"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

### Writing Unit Tests

#### Testing Validation Schemas

```typescript
// __tests__/auth-validation.test.ts
import { describe, it, expect } from "vitest";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

describe("Auth Validation Schema", () => {
  it("accepts valid email and password", () => {
    const result = authSchema.safeParse({
      email: "test@example.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = authSchema.safeParse({
      email: "invalid-email",
      password: "123456",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });
});
```

#### Testing React Components

```typescript
// __tests__/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '@repo/design-system/components/ui/button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

---

## E2E Tests (Playwright)

### File Structure

```
with-supabase/
├── e2e/
│   └── auth.spec.ts               # E2E tests
├── playwright.config.ts           # Playwright config
```

### Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3005",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3005",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### Writing E2E Tests

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("login page renders correctly", async ({ page }) => {
    await expect(
      page.getByText("Login to your account", { exact: true }),
    ).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.locator("#email").fill("wrong@test.com");
    await page.locator("#password").fill("wrongpassword");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(
      page.locator('[role="alert"][data-slot="alert"]'),
    ).toContainText(/invalid email or password/i, { timeout: 10000 });
  });

  test("successful login redirects to dashboard", async ({ page }) => {
    const email = process.env.USER_A_EMAIL!;
    const password = process.env.USER_A_PASSWORD!;

    test.skip(!email || !password, "Test credentials not configured");

    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
  });
});
```

### Running E2E Tests

```bash
# Headless (default)
pnpm test

# With visible browser
pnpm test:headed

# Interactive UI mode
pnpm test:ui

# Single test file
pnpm exec playwright test auth.spec.ts

# Debug mode
pnpm exec playwright test --debug
```

---

## Git Hooks (Husky)

Tests are automatically enforced via git hooks:

### Pre-commit Hook

Runs on every `git commit`:

- **lint-staged**: Formats staged files with Prettier
- **Unit tests**: Runs Vitest tests

```bash
# .husky/pre-commit
pnpm exec lint-staged
pnpm --filter with-supabase test:unit -- --run --passWithNoTests
```

### Pre-push Hook

Runs on every `git push`:

- **Type checking**: Verifies TypeScript types
- **E2E tests**: Runs Playwright tests

```bash
# .husky/pre-push
pnpm check-types
pnpm --filter with-supabase test
```

### Bypassing Hooks (Emergency Only)

```bash
git commit --no-verify -m "hotfix: critical fix"
git push --no-verify
```

---

## Environment Variables for Testing

Add test credentials to your `.env.local`:

```env
# Test user credentials (for E2E tests)
USER_A_EMAIL=test@example.com
USER_A_PASSWORD=testpassword123
```

These are used by Playwright E2E tests for authentication flows.

---

## Test Coverage

### Generating Coverage Reports

```bash
# Unit test coverage
pnpm --filter with-supabase test:unit -- --coverage
```

### Coverage Targets

| Type       | Target |
| ---------- | ------ |
| Statements | 70%    |
| Branches   | 60%    |
| Functions  | 70%    |
| Lines      | 70%    |

---

## Best Practices

### Do's

- ✅ Write tests for validation schemas
- ✅ Test error states and edge cases
- ✅ Use descriptive test names
- ✅ Keep tests isolated and independent
- ✅ Use test IDs for E2E selectors when needed

### Don'ts

- ❌ Don't test implementation details
- ❌ Don't test third-party libraries
- ❌ Don't write brittle tests with hardcoded timeouts
- ❌ Don't skip flaky tests without fixing them

---

## Troubleshooting

### Common Issues

**Tests fail to find elements**

- Use `page.locator('#id')` for ID selectors
- Use `{ exact: true }` for text matching
- Add timeouts for async operations

**E2E tests timeout**

- Increase timeout in config
- Check if dev server is running
- Verify network requests complete

**Unit tests can't import modules**

- Check path aliases in `vitest.config.ts`
- Verify `jsdom` environment is set

---

## Related Docs

- [System Design](../architecture/system-design.md) - Architecture overview
- [Server Actions](../api/server-actions.md) - Testing server actions
- [Quickstart](../getting-started/quickstart.md) - Development setup

---

**Last Updated:** 2025-12-17
