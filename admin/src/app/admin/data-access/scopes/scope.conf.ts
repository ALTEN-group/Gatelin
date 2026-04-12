import { ActivatedRouteSnapshot } from "@angular/router";
import { toSelectItems } from "@core/utils/primeng/to-select-items";
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
import { Route } from "app/admin/data-access/routes/route.model";
import { Scope } from "app/admin/data-access/scopes/scope.model";

export const SCOPE_COLUMNS: (
  payload: ActivatedRouteSnapshot,
) => StrictCrudItemOptions<Scope>[] = ({ data }) => [
  ID_CONFIG,
  {
    key: "routeId",
    label: "Route",
    controlType: CONTROL_TYPES.SELECT,
    options: toSelectItems<Route>(data.routes, "name"),
    controlOptions: {
      validators: [required],
    },
    columnOptions: {
      isHardHidden: true,
    },
  },
  {
    key: "routeName",
    label: "Route",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    options: data.routes.map((r: Route) => ({
      label: r.name,
      value: r.name,
    })),
    controlOptions: {
      hidden: true,
    },
    columnOptions: {
      filterType: CONTROL_TYPES.MULTISELECT,
    },
  },
  {
    key: "name",
    label: "Nom",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [required, minlength(1), maxlength(50)],
    },
  },
  ...AUDIT_CONFIG,
  ...ARCHIVED_CONFIG,
];
