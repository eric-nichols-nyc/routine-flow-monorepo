import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Testing Lab/);
    await expect(
      page.getByRole("heading", { name: "Testing Lab", level: 1 }),
    ).toBeVisible();
  });

  test("should navigate to hooks page", async ({ page }) => {
    await page.goto("/");

    await page.click('a[href="/hooks"]');

    await expect(page).toHaveURL("/hooks");
    await expect(
      page.getByRole("heading", { name: "Custom Hooks Testing" }),
    ).toBeVisible();
  });

  test("should navigate to api-mocking page", async ({ page }) => {
    await page.goto("/");

    await page.click('a[href="/api-mocking"]');

    await expect(page).toHaveURL("/api-mocking");
    await expect(
      page.getByRole("heading", { name: "API Mocking with MSW" }),
    ).toBeVisible();
  });

  test("should navigate to e2e page", async ({ page }) => {
    await page.goto("/");

    await page.click('a[href="/e2e"]');

    await expect(page).toHaveURL("/e2e");
    await expect(
      page.getByRole("heading", { name: "E2E Testing with Playwright" }),
    ).toBeVisible();
  });

  test("sidebar navigation should be visible on all pages", async ({
    page,
  }) => {
    const pages = ["/", "/hooks", "/api-mocking", "/e2e"];

    for (const path of pages) {
      await page.goto(path);
      await expect(page.locator("aside")).toBeVisible();
      await expect(page.locator("nav")).toBeVisible();
    }
  });
});
