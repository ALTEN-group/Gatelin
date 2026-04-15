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
import { GatewayRole } from "app/admin/data-access/roles/role.model";

export const ROLE_COLUMNS: StrictCrudItemOptions<GatewayRole>[] = [
  ID_CONFIG,
  {
    key: "name",
    label: "Nom",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [required, minlength(1), maxlength(50)],
    },
  },
  {
    key: "description",
    label: "Description",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [maxlength(100)],
    },
  },
  {
    key: "colorCode",
    label: "Couleur",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      hidden: true,
    },
  },
  {
    key: "active",
    label: "Actif",
    controlType: CONTROL_TYPES.CHECKBOX,
  },
  ...AUDIT_CONFIG,
  ...ARCHIVED_CONFIG,
];
