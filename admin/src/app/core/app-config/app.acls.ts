import { EntityRouteMapping } from "@core/acl/acls.model";

/**
 * Base entity-routes mapping, defining mapping between routes and their id in the database.
 */
export const ENTITY_ROUTE_MAPPING: EntityRouteMapping = {
  consumers: {
    get: 4, // getConsumers
  },
  routes: {
    get: 6, // searchRoutes
    getHistory: 7,
    update: 8,
    create: 9,
    archive: 10,
    restore: 11,
  },
  services: {
    get: 12, // searchServices
    getHistory: 13,
    update: 14,
    create: 15,
    archive: 16,
    restore: 17,
  },
  resources: {
    get: 18, // searchResources
    getHistory: 19,
    update: 20,
    create: 21,
    archive: 22,
    restore: 23,
  },
  operations: {
    get: 24, // searchOperations
    getHistory: 25,
    update: 26,
    create: 27,
    archive: 28,
    restore: 29,
  },
  cors: {
    get: 30, // searchCors
    getHistory: 31,
    update: 32,
    create: 33,
    archive: 34,
    restore: 35,
  },
  fields: {
    get: 36, // searchFields
    getHistory: 37,
    update: 38,
    create: 39,
    archive: 40,
    restore: 41,
  },
  scopes: {
    get: 42, // searchScopes
    getHistory: 43,
    update: 44,
    create: 45,
    archive: 46,
    restore: 47,
  },
  roles: {
    get: 48, // searchRoles
    getHistory: 49,
    create: 50,
    update: 51,
    archive: 52,
    restore: 53,
  },
  permissions: {
    get: 54, // searchPermissions
    getHistory: 55, // getPermissionHistory
    create: 56, // addPermissions
    update: 57, // updatePermissions
    archive: 58, // deletePermissions (DELETE /gatelin/permissions)
  },
  methods: {
    get: 59, // searchMethods
    update: 60, // updateMethods
  },
  applications: {
    get: 61, // searchApplications
    getHistory: 62, // getApplicationHistory
    create: 63, // addApplications
    update: 64, // updateApplications
    archive: 65, // archiveApplications
    restore: 66, // restoreApplications
  },
  conditions: {
    get: 67, // searchConditions
    getHistory: 68, // getConditionHistory
    update: 69, // updateConditions
    create: 70, // addConditions
    archive: 71, // archiveConditions
    restore: 72, // restoreConditions
  },
};
