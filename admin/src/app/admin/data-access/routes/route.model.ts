import { ArchiveInfo } from "@dwtechs/crud-builder";

/**
 * Represents a gateway route
 */
export interface Route extends ArchiveInfo {
  id: number | null;
  serviceId: number | null;
  serviceName: string;
  resourceId: number | null;
  resourceName: string;
  operationId: number[];
  operationName: string[];
  methodIds: number[];
  methodNames: string[];
  name: string;
  description: string;
  pattern: string;
  isProtected: boolean;
  locked: boolean;
}

/**
 * Creates a new Route entity with default values
 * @returns {Route} A new Route object with null/default values
 * @example
 * const newRoute = routeFactory();
 */
export const routeFactory = (): Route => ({
  id: null,
  serviceId: null,
  serviceName: "",
  resourceId: null,
  resourceName: "",
  operationId: [],
  operationName: [],
  methodIds: [],
  methodNames: [],
  name: "",
  description: "",
  pattern: "",
  isProtected: false,
  locked: false,
  ...new ArchiveInfo(),
});
