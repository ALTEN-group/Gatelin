import { ARCHIVED_CONFIG } from "@core/utils/field-config/archived.config";
import { AUDIT_CONFIG } from "@core/utils/field-config/audit.config";
import {
  CONTROL_TYPES,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";
import { Cors } from "app/admin/data-access/cors/cors.model";

export const CORS_COLUMNS: StrictCrudItemOptions<Cors>[] = [
  ID_CONFIG,
  {
    key: "name",
    label: "Name",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [required, minlength(1), maxlength(50)],
      minWidth: "100%",
    },
  },
  ...ARCHIVED_CONFIG,
  ...AUDIT_CONFIG,
];
