/**
 * Exhaustive list of all administrable entities in the application.
 * Extend this array when adding a new administrable entity.
 * Used by ACL, navigation, table configuration, preferences, etc.
 */
export const ADMIN_ENTITIES = [
  "routes",
  "consumers",
  "services",
  "resources",
  "cors",
  "operations",
  "methods",
  "fields",
  "scopes",
  "roles",
  "permissions",
  "applications",
  "conditions",
] as const;

export type AdminEntity = (typeof ADMIN_ENTITIES)[number];
