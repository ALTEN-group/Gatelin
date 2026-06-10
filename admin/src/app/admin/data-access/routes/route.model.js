import { ArchiveInfo } from "@dwtechs/crud-builder";
/**
 * Creates a new Route entity with default values
 * @returns {Route} A new Route object with null/default values
 * @example
 * const newRoute = routeFactory();
 */
export const routeFactory = () => ({
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
    protected: false,
    core: false,
    ...new ArchiveInfo(),
});
//# sourceMappingURL=route.model.js.map