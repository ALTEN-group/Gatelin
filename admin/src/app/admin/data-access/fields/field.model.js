import { ArchiveInfo } from "@dwtechs/crud-builder";
export const fieldFactory = () => ({
    id: null,
    resourceId: null,
    resourceName: "",
    serviceId: null,
    serviceName: "",
    name: "",
    core: false,
    ...new ArchiveInfo(),
});
//# sourceMappingURL=field.model.js.map