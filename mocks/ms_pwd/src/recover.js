import { log } from "@dwtechs/winstan";
import { readTemplate, renderPage } from "./render.js";

const formPage = renderPage("Password recovery", readTemplate("recover-form.html"));
const sentPage = renderPage("Password recovery", readTemplate("recover-sent.html"));

/**
 * Fake password-recovery pages for local admin-login link tests.
 * @param {import('express').Express} app
 */
export function mountRecoverPages(app) {
  app.get("/foxnox/web/recover", (_req, res) => {
    log.info("GET /foxnox/web/recover (mock recovery page)");
    res.type("html").send(formPage);
  });

  app.post("/foxnox/web/recover", (req, res) => {
    const email = String(req.body?.email ?? "").trim();
    log.info(`POST /foxnox/web/recover (mock) email=${email || "(empty)"}`);
    res.type("html").send(sentPage);
  });
}
