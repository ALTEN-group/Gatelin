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
import { Service } from "app/admin/data-access/services/service.model";

export const SERVICE_COLUMNS: StrictCrudItemOptions<Service>[] = [
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
    key: "pattern",
    label: "Pattern",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [required, minlength(1), maxlength(20)],
    },
  },
  {
    key: "locked",
    label: "Verrouillé",
    controlType: CONTROL_TYPES.CHECKBOX,
  },
  ...createArchivedConfig(),
];
