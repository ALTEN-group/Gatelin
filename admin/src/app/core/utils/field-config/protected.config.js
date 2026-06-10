import { buildProtectedCellRenderer } from "@core/utils/renderers/protected.renderer";
import { CONTROL_TYPES } from "@dwtechs/crud-builder";
export const PROTECTED_CONFIG = {
    key: "protected",
    label: "Protected",
    controlType: CONTROL_TYPES.CHECKBOX,
    columnOptions: {
        defaultWidth: "60px",
        filterType: CONTROL_TYPES.CHECKBOX,
        customCellRenderer: buildProtectedCellRenderer(),
        customHeaderRenderer: () => "🔑",
    },
};
//# sourceMappingURL=protected.config.js.map