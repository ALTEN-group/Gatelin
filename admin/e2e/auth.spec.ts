import { expect, test } from "@playwright/test";
import { loginAs, logout } from "./helpers/auth";

test.describe("Auth shell", () => {
  test("redirects unauthenticated users from a protected route to login", async ({
    page,
  }) => {
    await page.goto("consumers");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText("Connexion")).toBeVisible();
  });

  test("logs out from the user menu and returns to login", async ({ page }) => {
    await loginAs(page);
    await expect(page).toHaveURL(/\/consumers/);

    await logout(page);
    await expect(page.getByText("Connexion")).toBeVisible();

    await page.goto("consumers");
    await expect(page).toHaveURL(/\/login/);
  });
});
