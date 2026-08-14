import { defineConfig, devices } from "@playwright/test";

/**
 * Admin is served behind Traefik at /gatelin/ in the docker-compose stack.
 * Start the stack first: `./scripts/start-dev.sh` from the repo root.
 *
 * Override with E2E_BASE_URL if needed (must end with a trailing slash).
 */
const baseURL = (process.env.E2E_BASE_URL ?? "http://localhost:8100/gatelin/").replace(
  /\/?$/,
  "/",
);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
