import { ArchiveInfo } from "@dwtechs/crud-builder";
export const conditionFactory = () => ({
    id: null,
    name: "",
    fieldId: null,
    fieldName: "",
    op: "",
    value: "",
    color: null,
    ...new ArchiveInfo(),
});
//# sourceMappingURL=condition.model.js.map