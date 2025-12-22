import { test, expect } from "@playwright/test";

test.describe("Toggle Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/hooks");
  });

  test("should start as OFF", async ({ page }) => {
    const toggle = page.getByTestId("toggle-value");
    await expect(toggle).toHaveText("OFF");
  });

  test("should toggle on/off", async ({ page }) => {
    const toggle = page.getByTestId("toggle-value");
    const toggleBtn = page.getByRole("button", { name: "Toggle" });

    await toggleBtn.click();
    await expect(toggle).toHaveText("ON");

    await toggleBtn.click();
    await expect(toggle).toHaveText("OFF");
  });

  test("should set to true with Set True button", async ({ page }) => {
    const toggle = page.getByTestId("toggle-value");
    const setTrueBtn = page.getByRole("button", { name: "Set True" });

    await setTrueBtn.click();
    await expect(toggle).toHaveText("ON");

    // Clicking again should keep it ON
    await setTrueBtn.click();
    await expect(toggle).toHaveText("ON");
  });

  test("should set to false with Set False button", async ({ page }) => {
    const toggle = page.getByTestId("toggle-value");
    const toggleBtn = page.getByRole("button", { name: "Toggle" });
    const setFalseBtn = page.getByRole("button", { name: "Set False" });

    // First set to ON
    await toggleBtn.click();
    await expect(toggle).toHaveText("ON");

    // Then set to false
    await setFalseBtn.click();
    await expect(toggle).toHaveText("OFF");
  });
});
