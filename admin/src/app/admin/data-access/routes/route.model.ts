import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

/**
 * Represents a gateway route
 */
export interface Route extends ArchiveInfo {
  id: number | null;
  serviceId: number | null;
  serviceName: string;
  resourceId: number | null;
  resourceName: string;
  operationId: number | null;
  operationName: string;
  description: string;
  pattern: string;
  methods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
  jwt: boolean;
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
  operationId: null,
  operationName: "",
  description: "",
  pattern: "",
  methods: [],
  jwt: false,
  locked: false,
  ...new ArchiveInfo(),
});
