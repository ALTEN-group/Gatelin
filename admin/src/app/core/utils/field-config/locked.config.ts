import { buildLockedCellRenderer } from "@core/utils/renderers/locked.renderer";
import { CONTROL_TYPES, StrictCrudItemOptions } from "@dwtechs/crud-builder";

export const LOCKED_CONFIG: StrictCrudItemOptions<{ locked: boolean }> = {
  key: "locked",
  label: "Locked",
  controlType: CONTROL_TYPES.CHECKBOX,
  columnOptions: {
    customCellRenderer: buildLockedCellRenderer(),
  },
};
