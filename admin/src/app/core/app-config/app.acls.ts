import { Calls } from "@crud/core/utils/crud-service/crud.model";

type RoutesMapping = {
  [key in keyof Calls<unknown>]: number;
};

export type AclsMapping = { [key: string]: RoutesMapping };

/** mapped type to have boolean instead of number in RoutesMapping */
export type Acls = {
  [key: string]: {
    [key in keyof RoutesMapping]: boolean;
  };
};

/**
 * Base ACLs for the application, defining mapping between routes and their id in the database.
 */
export const BASE_ACLS: AclsMapping = {
  consumers: {
    get: 1,
  },
  routes: {
    get: 6,
    create: 9,
    update: 8,
    archive: 10,
    getHistory: 7,
  },
  services: {
    get: 11,
    create: 14,
    update: 13,
    archive: 15,
    getHistory: 12,
  },
  resources: {
    get: 16,
    create: 19,
    update: 18,
    archive: 20,
    getHistory: 17,
  },
  operations: {
    get: 21,
    create: 24,
    update: 23,
    archive: 25,
    getHistory: 22,
  },
  cors: {
    get: 26,
    create: 29,
    update: 28,
    archive: 30,
    getHistory: 27,
  },
};
