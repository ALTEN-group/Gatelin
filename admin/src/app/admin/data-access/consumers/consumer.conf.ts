import { ActivatedRouteSnapshot } from "@angular/router";
import { Role } from "@core/roles/role.class";
import { toSelectItems } from "@core/utils/primeng/to-select-items";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { INPUT_TYPES } from "@crud/core/models/input-type.model";
import { ARCHIVED_CONFIG } from "@crud/core/utils/confs/archived-config";
import { ID_CONFIG } from "@crud/core/utils/confs/id-config";
import {
  maxlength,
  minlength,
  required,
} from "@crud/form/utils/common.validators";
import { Consumer } from "app/admin/data-access/consumers/consumer.model";

export const CONSUMER_COLUMNS: (
  payload: ActivatedRouteSnapshot,
) => StrictCrudItemOptions<Consumer>[] = ({ data }) => [
  ID_CONFIG,
  {
    key: "userId",
    label: "User ID",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [required, minlength(3), maxlength(30)],
    },
  },
  {
    key: "nickname",
    label: "Nom",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [required, minlength(3), maxlength(30)],
    },
  },
  {
    key: "accessToken",
    label: "Access Token",
    controlType: CONTROL_TYPES.TEXTAREA,
    columnOptions: {
      defaultWidth: "300px",
    },
    controlOptions: {
      validators: [required, minlength(28), maxlength(8000)],
    },
  },
  {
    key: "refreshToken",
    label: "Refresh Token",
    controlType: CONTROL_TYPES.TEXTAREA,
    columnOptions: {
      defaultWidth: "300px",
    },
    controlOptions: {
      validators: [required, minlength(28), maxlength(8000)],
    },
  },
  {
    key: "roles",
    label: "Rôles",
    controlType: CONTROL_TYPES.MULTISELECT,
    options: toSelectItems<Role>(data.roles, "name"),
    controlOptions: {
      validators: [required],
    },
  },
  ...ARCHIVED_CONFIG,
];
