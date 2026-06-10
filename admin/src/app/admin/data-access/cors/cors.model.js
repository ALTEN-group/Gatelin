import { ArchiveInfo } from "@dwtechs/crud-builder";
export const corsFactory = () => ({
    id: null,
    name: "",
    description: null,
    credentials: false,
    ...new ArchiveInfo(),
});
//# sourceMappingURL=cors.model.js.map