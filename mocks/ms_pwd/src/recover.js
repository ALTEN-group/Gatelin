import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { log } from "@dwtechs/winstan";

const webDir = join(dirname(fileURLToPath(import.meta.url)), "web");

/**
 * @param {string} name
 * @returns {string}
 */
function readTemplate(name) {
  return readFileSync(join(webDir, name), "utf8");
}

const layout = readTemplate("recover.html");
const formPage = layout.replace("{{body}}", readTemplate("recover-form.html"));
const sentPage = layout.replace("{{body}}", readTemplate("recover-sent.html"));

/**
 * Fake password-recovery pages for local admin-login link tests.
 * @param {import('express').Express} app
 */
export function mountRecoverPages(app) {
  app.get("/pwd/web/recover", (_req, res) => {
    log.info("GET /pwd/web/recover (mock recovery page)");
    res.type("html").send(formPage);
  });

  app.post("/pwd/web/recover", (req, res) => {
    const email = String(req.body?.email ?? "").trim();
    log.info(`POST /pwd/web/recover (mock) email=${email || "(empty)"}`);
    res.type("html").send(sentPage);
  });
}
