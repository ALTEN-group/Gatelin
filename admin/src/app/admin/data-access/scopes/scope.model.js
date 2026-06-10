import { ArchiveInfo } from "@dwtechs/crud-builder";
export const scopeFactory = () => ({
    id: null,
    routeId: null,
    routeName: "",
    resourceId: null,
    resourceName: "",
    name: "",
    core: false,
    ...new ArchiveInfo(),
});
//# sourceMappingURL=scope.model.js.map