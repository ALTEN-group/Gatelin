import { ArchiveInfo } from "@dwtechs/crud-builder";
export const gatewayApplicationFactory = () => ({
    id: null,
    name: "",
    description: "",
    core: false,
    ...new ArchiveInfo(),
});
//# sourceMappingURL=application.model.js.map