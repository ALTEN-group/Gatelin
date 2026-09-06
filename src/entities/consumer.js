// @ts-check
import { SQLEntity } from "@dwtechs/antity-pgsql";

/**
 * Consumer entity configuration for database operations.
 * Defines validation rules, types, and constraints for consumer data.
 *
 * Serves the admin search endpoint only, so `accessToken` and `refreshToken` are
 * absent: antity builds its SELECT list from `operations`, and roles with no
 * field ACL (Super admin, Admin) would otherwise read live JWTs for every
 * session. The cache warm-up reads them through `consumer-cache.js`.
 */
const consumerEntity = new SQLEntity("consumer", [
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
    key: "userId",
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
    key: "nickname",
    type: "string",
    min: 3,
    max: 30,
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
    key: "roles",
    type: "array",
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
    key: "archived",
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
]);

export default consumerEntity;
