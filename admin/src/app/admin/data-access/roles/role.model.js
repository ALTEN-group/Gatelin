import { ArchiveInfo } from "@dwtechs/crud-builder";
export const gatewayRoleFactory = () => ({
    id: null,
    appId: null,
    appName: "",
    name: "",
    description: "",
    color: "",
    active: true,
    ...new ArchiveInfo(),
});
//# sourceMappingURL=role.model.js.map