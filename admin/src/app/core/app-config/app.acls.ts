import { AclsMapping } from "@core/acl/acls.model";

/**
 * Base ACLs for the application, defining mapping between routes and their id in the database.
 */
export const BASE_ACLS: AclsMapping = {
  consumers: {
    get: 1,
  },
  routes: {
    get: 7,
    create: 10,
    update: 9,
    archive: 11,
    getHistory: 8,
  },
  services: {
    get: 13,
    create: 16,
    update: 15,
    archive: 17,
    getHistory: 14,
  },
  resources: {
    get: 19,
    create: 22,
    update: 21,
    archive: 23,
    getHistory: 20,
  },
  operations: {
    get: 25,
    create: 28,
    update: 27,
    archive: 29,
    getHistory: 26,
  },
  cors: {
    get: 31,
    create: 34,
    update: 33,
    archive: 35,
    getHistory: 32,
  },
  fields: {
    get: 37,
    getHistory: 38,
    update: 39,
    create: 40,
    archive: 41,
  },
  scopes: {
    get: 43,
    getHistory: 44,
    update: 45,
    create: 46,
    archive: 47,
  },
};
