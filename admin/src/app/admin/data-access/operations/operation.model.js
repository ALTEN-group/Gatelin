import { ArchiveInfo } from "@dwtechs/crud-builder";
export const operationFactory = () => ({
    id: null,
    name: "",
    description: "",
    color: null,
    core: false,
    ...new ArchiveInfo(),
});
//# sourceMappingURL=operation.model.js.map