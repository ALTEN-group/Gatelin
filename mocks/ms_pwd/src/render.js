import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const webDir = join(dirname(fileURLToPath(import.meta.url)), "web");
const layout = readFileSync(join(webDir, "recover.html"), "utf8");

/**
 * @param {string} name
 * @returns {string}
 */
export function readTemplate(name) {
  return readFileSync(join(webDir, name), "utf8");
}

/**
 * @param {string} heading
 * @param {string} body
 * @returns {string}
 */
export function renderPage(heading, body) {
  return layout.replaceAll("{{heading}}", heading).replace("{{body}}", body);
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
