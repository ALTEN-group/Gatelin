import { ArchiveInfo } from "@dwtechs/crud-builder";
export const permissionFactory = (roleId = null) => ({
    id: null,
    roleId,
    routeId: null,
    routeName: "",
    operationId: [],
    operationName: "",
    fields: null,
    scopes: null,
    conditionId: null,
    conditionName: null,
    serviceId: null,
    serviceName: null,
    resourceId: null,
    resourceName: null,
    ...new ArchiveInfo(),
});
//# sourceMappingURL=permission.model.js.map