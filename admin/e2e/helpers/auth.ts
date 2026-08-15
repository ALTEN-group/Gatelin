import { expect, type Page } from "@playwright/test";
import { getAdminCredentials, type E2eCredentials } from "./credentials";

export async function loginAs(
  page: Page,
  credentials: E2eCredentials = getAdminCredentials(),
): Promise<void> {
  await page.goto("login");
  await page.locator("#emailInput").fill(credentials.email);
  await page.locator("#passwordInput").fill(credentials.password);

  const loginResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/sessions") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Se connecter" }).click();
  const loginResponse = await loginResponsePromise;

  if (!loginResponse.ok()) {
    throw new Error(
      `Login failed with HTTP ${loginResponse.status()}. ` +
        `If this is 429, /sessions is rate-limited (20 / 15 min) — reduce e2e logins or wait.`,
    );
  }

  await expect(page).not.toHaveURL(/\/login(?:\?|$)/, { timeout: 30_000 });
}

export async function logout(page: Page): Promise<void> {
  await page.locator(".user-button button").click();
  await page.getByRole("menuitem", { name: "Logout" }).click();
  await expect(page).toHaveURL(/\/login/, { timeout: 30_000 });
}

const ENTITY_LINKS: Record<string, { label: RegExp; parent?: RegExp }> = {
  consumers: { label: /Consumers/ },
  routes: { label: /Routes/, parent: /Routing/ },
  services: { label: /Services/, parent: /Routing/ },
  resources: { label: /Resources/, parent: /Routing/ },
  operations: { label: /Operations/, parent: /Routing/ },
  methods: { label: /Methods/, parent: /Routing/ },
  roles: { label: /Roles/, parent: /Authorizations/ },
  permissions: { label: /Permissions/, parent: /Authorizations/ },
  applications: { label: /Applications/, parent: /Authorizations/ },
  scopes: { label: /Scopes/, parent: /Authorizations/ },
  conditions: { label: /Conditions/, parent: /Authorizations/ },
  fields: { label: /Fields/, parent: /Authorizations/ },
  cors: { label: /CORS/, parent: /Authorizations/ },
};

/**
 * In-app navigation via sidenav links.
 * Prefer this over `page.goto` for authenticated routes: a full reload re-runs
 * APP_INITIALIZER `refreshToken()` (PUT /sessions), which shares the login
 * rate limit (20 / 15 min) and will lock out later tests.
 *
 * Link accessible names include icon glyphs, so match with regexes.
 */
export async function openEntity(page: Page, path: string): Promise<void> {
  const meta = ENTITY_LINKS[path];
  if (!meta) {
    throw new Error(`Unknown entity path: ${path}`);
  }

  // Already on the target route (e.g. post-login lands on /consumers).
  if (new RegExp(`/${path}(?:\\?|$|/)`).test(page.url())) {
    return;
  }

  const link = page.getByRole("link", { name: meta.label });
  if (!(await link.first().isVisible())) {
    if (!meta.parent) {
      throw new Error(`Sidenav link not visible for /${path}`);
    }
    // Opening the parent navigates to its default child and expands the submenu.
    await page.getByRole("link", { name: meta.parent }).first().click();
    await expect(link.first()).toBeVisible({ timeout: 10_000 });
  }

  // Prefer the deepest matching link (submenu item over parent with same label).
  await link.last().click();
  await expect(page).toHaveURL(new RegExp(`/${path}`));
}
