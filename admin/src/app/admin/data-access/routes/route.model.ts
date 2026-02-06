import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

/**
 * Represents a gateway route
 */
export interface Route extends ArchiveInfo {
	id: number | null;
	api: string;
	action: string;
	service: string;
	description: string;
	pattern: string;
	methods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
	jwt: boolean;
	protected: boolean;
}

/**
 * Creates a new Route entity with default values
 * @returns {Route} A new Route object with null/default values
 * @example
 * const newRoute = routeFactory();
 */
export const routeFactory = (): Route => ({
	id: null,
	api: "",
	action: "",
	service: "",
	description: "",
	pattern: "",
	methods: [],
	jwt: false,
	protected: false,
	...new ArchiveInfo(),
});
