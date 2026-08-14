import { expect, test } from "@playwright/test";
import { loginAs, openEntity } from "./helpers/auth";

test.describe("Applications CRUD", () => {
  test("creates an application then archives it", async ({ page }) => {
    test.setTimeout(90_000);
    const name = `e2e-app-${Date.now()}`;

    await loginAs(page);
    await openEntity(page, "applications");
    await expect(page.locator("#table-toolbar .toolbar-title")).toHaveText(
      "Applications",
    );

    await page.locator("#table-toolbar button .pi-plus").click();
    const createDialog = page.getByRole("dialog");
    await expect(
      createDialog.getByRole("heading", { name: /Create - Application/i }),
    ).toBeVisible();

    // Description may be ACL-readonly on create; Name is the required field.
    await createDialog.locator("input").first().fill(name);

    const createResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/applications") &&
        response.request().method() === "POST",
    );
    await createDialog.getByRole("button", { name: "Submit" }).click();
    const createResponse = await createResponsePromise;
    expect(createResponse.ok()).toBeTruthy();

    const nameCell = page.getByRole("cell", { name });
    await expect(nameCell).toBeVisible({ timeout: 15_000 });

    // Rows open the edition dialog (no inline trash action on this table).
    await nameCell.click();
    const editDialog = page.getByRole("dialog");
    await expect(editDialog.getByRole("heading")).toBeVisible();

    await editDialog.getByRole("button", { name: "Archive" }).click();

    const confirm = page.getByRole("dialog").filter({
      hasText: /archive this view/i,
    });
    await expect(confirm).toBeVisible();

    const archiveResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/applications") &&
        response.request().method() === "POST" &&
        response.url().includes("archive"),
    );
    await confirm.getByRole("button", { name: "Confirm" }).click();
    const archiveResponse = await archiveResponsePromise;
    expect(archiveResponse.ok()).toBeTruthy();

    await page.getByRole("button", { name: "Refresh data" }).click();
    await expect(page.getByRole("cell", { name })).toHaveCount(0, {
      timeout: 15_000,
    });
  });
});
