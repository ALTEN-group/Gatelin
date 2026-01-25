/**
 * Represents a gateway route
 */
export interface Route {
  id: number | null;
  serviceId: number;
  route: string;
  service: string;
  description: string;
  pattern: string;
  methods: string[];
  jwt: boolean;
  updatedAt: Date | null;
  updaterId: number | null;
  updaterName: string | null;
  createdAt: Date | null;
  creatorId: number | null;
  creatorName: string | null;
  archived: boolean;
  archivedAt: Date | null;
}

/**
 * Creates a new Route entity with default values
 * @returns {Route} A new Route object with null/default values
 * @example
 * const newRoute = routeFactory();
 */
export const routeFactory = (): Route => ({
  id: null,
  serviceId: 0,
  route: "",
  service: "",
  description: "",
  pattern: "",
  methods: [],
  jwt: false,
  updatedAt: null,
  updaterId: null,
  updaterName: null,
  createdAt: null,
  creatorId: null,
  creatorName: null,
  archived: false,
  archivedAt: null,
});
