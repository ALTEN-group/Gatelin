import { AclsMapping } from "@crud/core/utils/acls/acls.model";

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
    history: 8,
  },
  services: {
    get: 13,
    create: 16,
    update: 15,
    archive: 17,
    history: 14,
  },
  resources: {
    get: 19,
    create: 22,
    update: 21,
    archive: 23,
    history: 20,
  },
  operations: {
    get: 25,
    create: 28,
    update: 27,
    archive: 29,
    history: 26,
  },
  cors: {
    get: 31,
    create: 34,
    update: 33,
    archive: 35,
    history: 32,
  },
};
