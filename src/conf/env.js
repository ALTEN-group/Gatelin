// @ts-check
import { isString } from "@dwtechs/checkard";
import { log } from "@dwtechs/winstan";
import { OPTIONAL_URL_VARS } from "./pwd.js";

/**
 * Environment variables Gatelin cannot work without.
 *
 * Each is read at module load in the file listed, so a missing value produces
 * `undefined` deep inside a request instead of a startup failure. Checking them
 * up front turns a silent misconfiguration into a refusal to boot.
 */
const REQUIRED = [
  ["APP_NAME", "used to build downstream service URLs"],
  ["ENV_NAME", "used to build downstream service URLs"],
  ["PWD_CHECK_URL", "Password service credential check endpoint"],
  ["USER_SEARCH_URL", "User service lookup endpoint"],
];

/**
 * Validates required environment variables.
 *
 * @return {string[]} Human-readable problems; empty when the environment is valid
 */
export function collectEnvErrors() {
  const errors = [];

  for (const [name, usage] of REQUIRED) {
    // Trimmed first: isString(" ", "!0") is true, but a whitespace-only value
    // would build URLs like "http://   -ms_user-   :3000".
    const value = process.env[name]?.trim();
    if (!isString(value, "!0")) errors.push(`${name} is missing — ${usage}`);
    else if (name.endsWith("_URL") && !URL.canParse(value))
      errors.push(`${name} is not a valid URL: "${value}"`);
  }

  // Unset means the matching mid-login step is disabled, which is a valid
  // setup. A value that is present but malformed never is.
  for (const [name, usage] of OPTIONAL_URL_VARS) {
    const value = process.env[name]?.trim();
    if (isString(value, "!0") && !URL.canParse(value))
      errors.push(`${name} is not a valid URL: "${value}" — ${usage}`);
  }

  return errors;
}

/**
 * Throws unless every required environment variable is present and well formed.
 *
 * @throws {Error} Listing every problem at once, so a misconfigured deployment
 * does not have to be fixed one restart at a time.
 */
export function validateEnv() {
  const errors = collectEnvErrors();
  if (errors.length)
    throw new Error(
      `Invalid environment configuration:\n  - ${errors.join("\n  - ")}`,
    );

  const { APP_NAME, ENV_NAME } = process.env;
  const scheme = process.env.SERVER_SCHEME ?? "http://";
  const port = process.env.PORT ?? "3000";
  log.info(
    `Downstream service URLs resolve as ${scheme}${APP_NAME}-<service>-${ENV_NAME}:${port}`,
  );
}
