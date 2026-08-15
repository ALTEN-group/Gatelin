import { expect, test } from "@playwright/test";
import { loginAs } from "./helpers/auth";
import { getAdminCredentials } from "./helpers/credentials";

test.describe("Login page", () => {
  test("shows the connection form", async ({ page }) => {
    await page.goto("login");

    await expect(page.getByText("Connexion")).toBeVisible();
    await expect(page.locator("#emailInput")).toBeVisible();
    await expect(page.locator("#passwordInput")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Se connecter" }),
    ).toBeVisible();
  });

  test("rejects invalid credentials", async ({ page }) => {
    await page.goto("login");
    await page.locator("#emailInput").fill("admin@example.com");
    await page.locator("#passwordInput").fill("WrongPassword123!");

    const loginResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/sessions") &&
        response.request().method() === "POST",
    );
    await page.getByRole("button", { name: "Se connecter" }).click();
    const loginResponse = await loginResponsePromise;

    expect(loginResponse.ok()).toBeFalsy();
    await expect(page).toHaveURL(/\/login/);
  });

  test("logs in with a mock admin user and lands on consumers", async ({
    page,
  }) => {
    await loginAs(page, getAdminCredentials());
    await expect(page).toHaveURL(/\/consumers/);
  });
});
