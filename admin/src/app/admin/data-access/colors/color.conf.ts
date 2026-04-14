import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { INPUT_TYPES } from "@crud/core/models/input-type.model";
import { ARCHIVED_CONFIG } from "@crud/core/utils/confs/archived-config";
import { AUDIT_CONFIG } from "@crud/core/utils/confs/audit-config";
import { ID_CONFIG } from "@crud/core/utils/confs/id-config";
import {
    maxlength,
    minlength,
    required,
} from "@crud/form/utils/common.validators";
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
  ...AUDIT_CONFIG,
  ...ARCHIVED_CONFIG,
];
