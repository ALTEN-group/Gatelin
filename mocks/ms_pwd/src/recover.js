import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { log } from "@dwtechs/winstan";

const __dirname = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(__dirname, "web/recover.html"), "utf8");

/**
 * @param {string} bodyHtml
 * @returns {string}
 */
function render(bodyHtml) {
  return template.replace("{{body}}", bodyHtml);
}

const formBody = `
    <p>This is a stand-in for Foxnox <code>/pwd/web/recover</code>. Use it to verify the Gatelin admin “forgot password” link.</p>
    <form method="post">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required placeholder="you@example.com" autocomplete="email" />
      <button type="submit">Send reset link</button>
    </form>
`;

const sentBody = `
    <p class="ok">If an account exists for that email, a reset link would be sent. (Mock — nothing was emailed.)</p>
    <p><a href="">Back</a></p>
`;

/**
 * Fake password-recovery pages for local admin-login link tests.
 * @param {import('express').Express} app
 */
export function mountRecoverPages(app) {
  app.get("/pwd/web/recover", (_req, res) => {
    log.info("GET /pwd/web/recover (mock recovery page)");
    res.type("html").send(render(formBody));
  });

  app.post("/pwd/web/recover", (req, res) => {
    const email = String(req.body?.email ?? "").trim();
    log.info(`POST /pwd/web/recover (mock) email=${email || "(empty)"}`);
    res.type("html").send(render(sentBody));
  });
}
