import { buildProtectedCellRenderer } from "@core/utils/renderers/protected.renderer";
import { CONTROL_TYPES, StrictCrudItemOptions } from "@dwtechs/crud-builder";

export const PROTECTED_CONFIG: StrictCrudItemOptions<{
  protected: boolean;
}> = {
  key: "protected",
  label: "🔑",
  controlType: CONTROL_TYPES.CHECKBOX,
  columnOptions: {
    defaultWidth: "60px",
    customCellRenderer: buildProtectedCellRenderer(),
  },
};
