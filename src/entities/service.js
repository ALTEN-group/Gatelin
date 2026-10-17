// @ts-check
import { SQLEntity } from "@dwtechs/antity-pgsql";

const COOKIE_NAME_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
const COOKIE_NAME_MAX = 64;
const COOKIES_MAX = 20;

/**
 * Throws unless `v` is an array of valid, unique cookie names (RFC 6265 tokens).
 * @param {unknown} v
 */
function validateCookieNames(v) {
  if (!Array.isArray(v)) throw new Error("must be an array");
  if (v.length > COOKIES_MAX)
    throw new Error(`must contain at most ${COOKIES_MAX} cookie names`);
  for (const name of v) {
    if (
      typeof name !== "string" ||
      name.length > COOKIE_NAME_MAX ||
      !COOKIE_NAME_RE.test(name)
    )
      throw new Error(`invalid cookie name ${JSON.stringify(name)}`);
  }
  if (new Set(v).size !== v.length) throw new Error("duplicate cookie name");
}

export default new SQLEntity("service", [
  {
    key: "id",
    type: "integer",
    min: null,
    max: null,
    isTypeChecked: true,
    isFilterable: true,
    requiredFor: [],
    operations: ["SELECT"],
    isPrivate: false,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
  {
    key: "name",
    type: "string",
    min: 1,
    max: 20,
    isTypeChecked: true,
    isFilterable: true,
    requiredFor: ["POST"],
    operations: ["SELECT", "INSERT", "UPDATE"],
    isPrivate: false,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
  {
    key: "pattern",
    type: "string",
    min: 0,
    max: 1000,
    isTypeChecked: true,
    isFilterable: true,
    requiredFor: ["POST"],
    operations: ["SELECT", "INSERT", "UPDATE"],
    isPrivate: false,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
  {
    key: "core",
    type: "boolean",
    min: null,
    max: null,
    isTypeChecked: true,
    isFilterable: true,
    requiredFor: [],
    operations: ["SELECT"],
    isPrivate: false,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
  {
    key: "forwardedCookies",
    type: "array",
    min: null,
    max: null,
    isTypeChecked: false,
    isFilterable: false,
    requiredFor: [],
    operations: ["SELECT", "INSERT", "UPDATE"],
    isPrivate: false,
    sanitizer: null,
    normalizer: null,
    validator: validateCookieNames,
  },
  {
    key: "archived",
    type: "boolean",
    min: null,
    max: null,
    isTypeChecked: true,
    isFilterable: true,
    requiredFor: ["POST"],
    operations: ["SELECT"],
    isPrivate: false,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
  {
    key: "creatorName",
    type: "string",
    min: 1,
    max: 100,
    isTypeChecked: true,
    isFilterable: false,
    requiredFor: [],
    operations: ["SELECT"],
    isPrivate: false,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
  {
    key: "updaterName",
    type: "string",
    min: 1,
    max: 100,
    isTypeChecked: true,
    isFilterable: false,
    requiredFor: [],
    operations: ["SELECT"],
    isPrivate: false,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
  {
    key: "createdAt",
    type: "string",
    min: null,
    max: null,
    isTypeChecked: false,
    isFilterable: false,
    requiredFor: [],
    operations: ["SELECT"],
    isPrivate: false,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
  {
    key: "updatedAt",
    type: "string",
    min: null,
    max: null,
    isTypeChecked: false,
    isFilterable: false,
    requiredFor: [],
    operations: ["SELECT"],
    isPrivate: false,
    sanitizer: null,
    normalizer: null,
    validator: null,
  },
]);
