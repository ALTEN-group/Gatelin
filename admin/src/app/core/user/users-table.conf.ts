import { ActivatedRouteSnapshot } from "@angular/router";
import { Role } from "@core/roles/role.class";
import { User } from "@core/user/user.class";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { INPUT_TYPES } from "@crud/core/models/input-type.model";
import { ARCHIVED_CONFIG } from "@crud/core/utils/confs/archived-config";
import { ID_CONFIG } from "@crud/core/utils/confs/id-config";
import { required } from "@form/utils/common.validators";
import { EmailValidator } from "@form/utils/email.validator";
import { LOCATION_CONFIG } from "@form/utils/location.config";
import { SelectItem } from "primeng/api";

export const USERS_TABLE_CONF: (
  payload: ActivatedRouteSnapshot,
) => StrictCrudItemOptions<User>[] = (payload) => [
  ID_CONFIG,
  {
    key: "portrait",
    controlType: CONTROL_TYPES.FILES,
    label: "Portrait",
    columnOptions: {},
    controlOptions: {
      minWidth: "100%",
      mediaType: "image",
    },
  },
  {
    key: "portrait_files",
    controlType: CONTROL_TYPES.FILES,
    label: "Hidden",
    columnOptions: {
      isHardHidden: true,
    },
    controlOptions: {
      hidden: true,
    },
  },
  {
    key: "firstName",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "Prénom",
    columnOptions: {},
    controlOptions: {
      width: "33.3%",
    },
  },
  {
    key: "lastName",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "Nom",
    columnOptions: {},
    controlOptions: {
      width: "33.3%",
    },
  },
  {
    key: "nickname",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "Surnom",
    columnOptions: {
      isSoftHidden: true,
    },
    controlOptions: {
      width: "33.3%",
    },
  },
  {
    key: "roles",
    controlType: CONTROL_TYPES.MULTISELECT,
    label: "Rôles",
    options: getRolesOptions(payload.data.roles),
    columnOptions: {},
  },
  {
    key: "phone",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "Téléphone",
    columnOptions: {
      isSoftHidden: true,
    },
  },
  {
    key: "email",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "Email",
    columnOptions: {
      defaultWidth: "200px",
    },
    controlOptions: {
      validators: [required, EmailValidator],
    },
  },
  {
    key: "updatedAt",
    controlType: CONTROL_TYPES.DATE,
    label: "Mise à jour",
    controlOptions: {
      hidden: true,
    },
  },
  {
    key: "active",
    controlType: CONTROL_TYPES.CHECKBOX,
    label: "Actif",
    columnOptions: {
      tooltip: (cellValue) => (cellValue ? "Actif" : "Inactif"),
    },
    controlOptions: {
      hidden: true,
    },
  },
  ...LOCATION_CONFIG,
  ...ARCHIVED_CONFIG,
];

function getRolesOptions(roles: Role[]): SelectItem[] {
  return roles.map((role: Role) => ({
    value: role.id,
    label: role.name,
    styleClass: `p-chip ${role.color}`,
  }));
}
