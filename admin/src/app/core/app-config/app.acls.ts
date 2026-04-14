import { AclsMapping } from "@crud/core/utils/acls/acls.model";

/**
 * Base ACLs for the application, defining mapping between routes and their id in the database.
 */
export const BASE_ACLS: AclsMapping = {
  consumers: {
    get: 4, // getConsumers
  },
  routes: {
    get: 6, // searchRoutes
    history: 7,
    update: 8,
    create: 9,
    archive: 10,
  },
  services: {
    get: 11, // searchServices
    history: 12,
    update: 13,
    create: 14,
    archive: 15,
  },
  resources: {
    get: 16, // searchResources
    history: 17,
    update: 18,
    create: 19,
    archive: 20,
  },
  operations: {
    get: 21, // searchOperations
    history: 22,
    update: 23,
    create: 24,
    archive: 25,
  },
  cors: {
    get: 26, // searchCors
    history: 27,
    update: 28,
    create: 29,
    archive: 30,
  },
  fields: {
    get: 31, // searchFields
    history: 32,
    update: 33,
    create: 34,
    archive: 35,
  },
  scopes: {
    get: 36, // searchScopes
    history: 37,
    update: 38,
    create: 39,
    archive: 40,
  },
  roles: {
    get: 41, // searchRoles
    history: 42,
    create: 43,
    update: 44,
    archive: 45,
  },
  colors: {
    get: 46, // searchColors
    history: 47,
    create: 48,
    update: 49,
    archive: 50,
  },
};
