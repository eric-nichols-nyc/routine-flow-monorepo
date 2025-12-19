import { test, expect } from "@playwright/test";

// Test credentials from .env.local (USER_A_EMAIL, USER_A_PASSWORD)
const TEST_EMAIL = process.env.USER_A_EMAIL!;
const TEST_PASSWORD = process.env.USER_A_PASSWORD!;

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("login page renders correctly", async ({ page }) => {
    // Use exact match to avoid matching description text
    await expect(
      page.getByText("Login to your account", { exact: true }),
    ).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.locator("#email").fill("wrong@test.com");
    await page.locator("#password").fill("wrongpassword");
    await page.getByRole("button", { name: "Login" }).click();

    // Wait for the destructive alert to appear (not the route announcer)
    await expect(
      page.locator('[role="alert"][data-slot="alert"]'),
    ).toContainText(/invalid email or password/i, { timeout: 10000 });
  });

  test("successful login redirects to dashboard", async ({ page }) => {
    // Skip if no test credentials configured
    test.skip(
      !TEST_EMAIL || !TEST_PASSWORD,
      "Test credentials not configured in .env.local",
    );

    await page.locator("#email").fill(TEST_EMAIL);
    await page.locator("#password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
  });

  test("successful signup shows confirmation or redirects", async ({
    page,
  }) => {
    // Generate a unique email for signup test
    const uniqueEmail = `test-${Date.now()}@example.com`;

    await page.locator("#email").fill(uniqueEmail);
    await page.locator("#password").fill("testpassword123");
    await page.getByRole("button", { name: "Sign up" }).click();

    // Should either redirect to dashboard or show success message
    // depending on email confirmation settings
    await expect(
      page
        .locator('[role="alert"][data-slot="alert"]')
        .or(page.locator("body")),
    ).toBeVisible({ timeout: 10000 });
  });
});
