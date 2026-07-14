import { AdminEntity } from "@core/app-config/app.entities";
import { Calls } from "@dwtechs/ngx-crud-builder";

/**
 * Maps each CRUD operation to a gateway route ID.
 * @example
 * const routesMapping: RoutesMapping = {
 *   get:            12,
 *   getById:        13,
 *   getAll:         14,
 *   getAndCacheAll: 15,
 *   create:         16,
 *   update:         17,
 *   archive:        18,
 *   restore:        19,
 *   updateFiles:    20,
 *   getHistory:     21,
 * };
 */
type RoutesMapping = {
  [key in keyof Calls<unknown>]: number;
};

/**
 * Maps each administrable entity to its CRUD route IDs.
 * @example
 * const entityRouteMapping: EntityRouteMapping = {
 *   routes:       { get: 1,  create: 2,  update: 3,  archive: 4,  ... },
 *   consumers:    { get: 5,  create: 6,  update: 7,  archive: 8,  ... },
 *   operations:   { get: 9,  create: 10, update: 11, archive: 12, ... },
 *   // ...one entry per AdminEntity
 * };
 */
export type EntityRouteMapping = { [key in AdminEntity]: RoutesMapping };

/**
 * ACL result for a single entity: one entry per CRUD operation.
 * @example
 * const acls: Acls = {
 *   get:    { allowed: true,  operations: [1, 2], fields: ["id", "name"] },
 *   create: { allowed: true,  operations: [1],    fields: [] },
 *   update: { allowed: false, operations: [],      fields: [] },
 *   archive:{ allowed: false, operations: [],      fields: [] },
 * };
 */
export type Acls = {
  [key in keyof RoutesMapping]: {
    allowed: boolean;
    operations: number[];
    fields: string[];
  };
};

/**
 * Full ACL map for the whole application: one `Acls` entry per administrable entity.
 * @example
 * const aclsMapping: AclsMapping = {
 *   routes:     { get: { allowed: true, operations: [1], fields: [] }, create: { allowed: true, ... }, ... },
 *   consumers:  { get: { allowed: true, operations: [2], fields: ["name"] }, create: { allowed: false, ... }, ... },
 *   operations: { get: { allowed: true, operations: [],  fields: [] }, create: { allowed: false, ... }, ... },
 *   // ...one entry per AdminEntity
 * };
 */
export type AclsMapping = {
  [key in AdminEntity]: Acls;
};
