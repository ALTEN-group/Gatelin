import { buildProtectedCellRenderer } from "@core/utils/renderers/protected.renderer";
import { CONTROL_TYPES, StrictCrudItemOptions } from "@dwtechs/crud-builder";

export const PROTECTED_CONFIG: StrictCrudItemOptions<{
  protected: boolean;
}> = {
  key: "protected",
  label: "Protected",
  controlType: CONTROL_TYPES.CHECKBOX,
  columnOptions: {
    defaultWidth: "60px",
    filterType: CONTROL_TYPES.CHECKBOX,
    customCellRenderer: buildProtectedCellRenderer(),
    customHeaderRenderer: () => `<span>🔑</span>`,
    headerTooltip: "Protected",
  },
};
