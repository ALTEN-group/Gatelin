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
  ...createArchivedConfig(),
];
