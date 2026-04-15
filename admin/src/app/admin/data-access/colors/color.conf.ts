import {
  CONTROL_TYPES,
  createArchivedConfig,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";
import { Color } from "app/admin/data-access/colors/color.model";

export const COLOR_COLUMNS: StrictCrudItemOptions<Color>[] = [
  ID_CONFIG,
  {
    key: "name",
    label: "Nom",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [required, minlength(1), maxlength(30)],
    },
  },
  {
    key: "code",
    label: "Code",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [required, minlength(4), maxlength(7)],
    },
  },
  ...createArchivedConfig(),
];
