import { ArchiveInfo } from "@dwtechs/crud-builder";
export const serviceFactory = () => ({
    id: null,
    name: "",
    pattern: "",
    core: false,
    ...new ArchiveInfo(),
});
//# sourceMappingURL=service.model.js.map