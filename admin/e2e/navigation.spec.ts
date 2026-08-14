import { expect, test } from "@playwright/test";
import { loginAs, openEntity } from "./helpers/auth";

/**
 * Entity routes that render the shared tbl-table chrome.
 * One login + in-app sidenav navigation (avoids PUT /sessions per page.goto).
 */
const TABLE_PAGES = [
  { path: "consumers", title: "Consumers" },
  { path: "routes", title: "Routes" },
  { path: "services", title: "Services" },
  { path: "resources", title: "Resources" },
  { path: "operations", title: "Operations" },
  { path: "methods", title: "Methods" },
  { path: "cors", title: "CORS" },
  { path: "fields", title: "Fields" },
  { path: "scopes", title: "Scopes" },
  { path: "roles", title: "Roles" },
  { path: "applications", title: "Applications" },
  { path: "conditions", title: "Conditions" },
] as const;

test.describe("Authenticated navigation", () => {
  test("entity pages, permissions, and not-found load", async ({ page }) => {
    await loginAs(page);

    for (const { path, title } of TABLE_PAGES) {
      await openEntity(page, path);
      await expect(page.locator("#table-toolbar .toolbar-title")).toHaveText(
        title,
      );
    }

    await openEntity(page, "permissions");
    await expect(page.locator(".permissions-tree-container")).toBeVisible();
    await expect(page.getByRole("combobox")).toBeVisible();

    // Full reload is OK here: unknown path is outside the SPA shell intent,
    // and a single PUT /sessions is cheap relative to per-entity gotos.
    await page.goto("this-route-does-not-exist");
    await expect(page).toHaveURL(/\/not-found/);
    await expect(page.getByText("Not Found")).toBeVisible();
  });
});
