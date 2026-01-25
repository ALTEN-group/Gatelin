import { Role } from "@core/roles/role.class";
import { toSelectItems } from "@core/utils/primeng/to-select-items";
import { ConfBuilderPayload } from "@crud/core/models/conf-builder-payload.model";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { INPUT_TYPES } from "@crud/core/models/input-type.model";
import { ID_CONFIG } from "@crud/core/utils/confs/id-config";
import { Consumer } from "app/admin/data-access/consumers/consumer.model";

export const CONSUMER_COLUMNS: (
  payload: ConfBuilderPayload,
) => StrictCrudItemOptions<Consumer>[] = ({ data }) => [
  ID_CONFIG,
  {
    key: "nickname",
    label: "Nom",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
  },
  {
    key: "accessToken",
    label: "Access Token",
    controlType: CONTROL_TYPES.TEXTAREA,
    columnOptions: {
      defaultWidth: "300px",
    },
  },
  {
    key: "refreshToken",
    label: "Refresh Token",
    controlType: CONTROL_TYPES.TEXTAREA,
    columnOptions: {
      defaultWidth: "300px",
    },
  },
  {
    key: "rolesArrayAgg",
    label: "Rôles",
    controlType: CONTROL_TYPES.MULTISELECT,
    options: toSelectItems<Role>(data.roles, "name"),
  },
  {
    key: "createdAt",
    label: "Créé le",
    controlType: CONTROL_TYPES.DATE,
  },
  {
    key: "creatorName",
    label: "Créé par",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
  },
  {
    key: "updatedAt",
    label: "Modifié le",
    controlType: CONTROL_TYPES.DATE,
  },
];
