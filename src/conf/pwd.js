// @ts-check

/**
 * Password-service endpoints.
 *
 * Every endpoint is configured on its own. Route naming is specific to each
 * password service, so no URL here can be derived from another one.
 *
 * Only the credential check is mandatory. The other three may be empty:
 * login still succeeds, mid-login challenges and ticket resume stay off.
 */

/**
 * Endpoints a password-only service does not have to expose.
 * @type {[string, string][]}
 */
export const OPTIONAL_URL_VARS = [
  ["PWD_CHALLENGES_URL", "Password service challenge mint endpoint"],
  ["PWD_TRUSTED_DEVICES_URL", "Password service trusted device check endpoint"],
  ["PWD_LOGIN_TICKET_URL", "Password service login ticket redeem endpoint"],
];

/**
 * @param {string} name
 * @returns {string|undefined}
 */
function read(name) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export const checkUrl = read("PWD_CHECK_URL");
export const challengesUrl = read("PWD_CHALLENGES_URL");
export const trustedDevicesUrl = read("PWD_TRUSTED_DEVICES_URL");
export const loginTicketUrl = read("PWD_LOGIN_TICKET_URL");
