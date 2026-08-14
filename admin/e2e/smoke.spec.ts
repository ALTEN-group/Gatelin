import { expect, test } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Authenticated smoke", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  test("consumers page is reachable after login", async ({ page }) => {
    await expect(page).toHaveURL(/\/consumers/);
    // Page chrome: the app shell should be present (sidenav / main layout).
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("can open the routes page from the app", async ({ page }) => {
    await page.goto("routes");
    await expect(page).toHaveURL(/\/routes/);
  });
});
