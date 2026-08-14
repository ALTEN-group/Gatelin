import { expect, type Page } from "@playwright/test";
import { getAdminCredentials, type E2eCredentials } from "./credentials";

export async function loginAs(
  page: Page,
  credentials: E2eCredentials = getAdminCredentials(),
): Promise<void> {
  await page.goto("login");
  await page.locator("#emailInput").fill(credentials.email);
  await page.locator("#passwordInput").fill(credentials.password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).not.toHaveURL(/\/login(?:\?|$)/, { timeout: 30_000 });
}
