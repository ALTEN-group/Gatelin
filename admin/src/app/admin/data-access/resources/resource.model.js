import { ArchiveInfo } from "@dwtechs/crud-builder";
export const resourceFactory = () => ({
    id: null,
    serviceId: null,
    serviceName: "",
    name: "",
    core: false,
    ...new ArchiveInfo(),
});
//# sourceMappingURL=resource.model.js.map