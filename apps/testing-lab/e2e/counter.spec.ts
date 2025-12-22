import { test, expect } from "@playwright/test";

test.describe("Counter Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/hooks");
  });

  test("should start at 0", async ({ page }) => {
    const counter = page.getByTestId("counter-value");
    await expect(counter).toHaveText("0");
  });

  test("should increment counter", async ({ page }) => {
    const counter = page.getByTestId("counter-value");
    const incrementBtn = page.getByRole("button", { name: "Increment" });

    await incrementBtn.click();
    await expect(counter).toHaveText("1");

    await incrementBtn.click();
    await expect(counter).toHaveText("2");
  });

  test("should decrement counter", async ({ page }) => {
    const counter = page.getByTestId("counter-value");
    const incrementBtn = page.getByRole("button", { name: "Increment" });
    const decrementBtn = page.getByRole("button", { name: "Decrement" });

    // First increment to 3
    await incrementBtn.click();
    await incrementBtn.click();
    await incrementBtn.click();
    await expect(counter).toHaveText("3");

    // Then decrement
    await decrementBtn.click();
    await expect(counter).toHaveText("2");
  });

  test("should not go below minimum (0)", async ({ page }) => {
    const counter = page.getByTestId("counter-value");
    const decrementBtn = page.getByRole("button", { name: "Decrement" });

    // Try to decrement below 0
    await decrementBtn.click();
    await decrementBtn.click();
    await expect(counter).toHaveText("0");
  });

  test("should not exceed maximum (10)", async ({ page }) => {
    const counter = page.getByTestId("counter-value");
    const incrementBtn = page.getByRole("button", { name: "Increment" });

    // Click 15 times
    for (let i = 0; i < 15; i++) {
      await incrementBtn.click();
    }

    await expect(counter).toHaveText("10");
  });

  test("should reset to initial value", async ({ page }) => {
    const counter = page.getByTestId("counter-value");
    const incrementBtn = page.getByRole("button", { name: "Increment" });
    const resetBtn = page.getByRole("button", { name: "Reset" });

    // Increment a few times
    await incrementBtn.click();
    await incrementBtn.click();
    await incrementBtn.click();
    await expect(counter).toHaveText("3");

    // Reset
    await resetBtn.click();
    await expect(counter).toHaveText("0");
  });

  test("should set to specific value", async ({ page }) => {
    const counter = page.getByTestId("counter-value");
    const setTo5Btn = page.getByRole("button", { name: "Set to 5" });

    await setTo5Btn.click();
    await expect(counter).toHaveText("5");
  });
});
