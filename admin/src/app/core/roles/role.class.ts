import { CrudItemBase } from "@dwtechs/crud-builder";

export interface Permission {
  route: number;
  operation: number[];
}

export class Role extends CrudItemBase {
  name = "";
  description = "";
  color = "";
  level = 0;
  permissions_old!: { [key: string]: number };
  permissions: Permission[] = [];
}

/**
 * Represents a full role.
 * Contains all characteristics of a role,
 * and all permissions stored as { functionalityKey: operationKey }
 * Used in roles table.
 */
export interface RoleWithPermissions extends Role {
  [functionalityKey: number]: number;
}

// Record to store access levels
// string key represents the functionality key (users, events...)
// Operation key represents the access level (1: read, 2: write...)
export type FunctionalityAccessLevel = Record<string, number>;
// TODO: i would like to store smthg like this instead: { 'users': 'read', 'events': 'write' }
