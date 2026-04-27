import { buildLockedCellRenderer } from "@core/utils/renderers/locked.renderer";
import { CONTROL_TYPES, StrictCrudItemOptions } from "@dwtechs/crud-builder";

export const CORE_CONFIG: StrictCrudItemOptions<{ core: boolean }> = {
  key: "core",
  label: "🔒",
  controlType: CONTROL_TYPES.CHECKBOX,
  columnOptions: {
    defaultWidth: "60px",
    filterType: CONTROL_TYPES.CHECKBOX,
    customCellRenderer: buildLockedCellRenderer(),
  },
};
