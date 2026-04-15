import { ActivatedRouteSnapshot } from "@angular/router";
import { toSelectItems } from "@core/utils/primeng/to-select-items";
import {
  CONTROL_TYPES,
  ID_CONFIG,
  INPUT_TYPES,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";
import { Operation } from "app/admin/data-access/operations/operation.model";
import { Permission } from "app/admin/data-access/permissions/permission.model";
import { Route } from "app/admin/data-access/routes/route.model";

export const PERMISSION_COLUMNS: (
  payload: ActivatedRouteSnapshot,
) => StrictCrudItemOptions<Permission>[] = ({ data }) => [
  ID_CONFIG,
  {
    key: "roleId",
    label: "Role ID",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.NUMBER,
    controlOptions: {
      hidden: true,
    },
  },
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
    key: "operationId",
    label: "Opération",
    controlType: CONTROL_TYPES.SELECT,
    options: toSelectItems<Operation>(data.operations, "name"),
    controlOptions: {
      validators: [required],
    },
    columnOptions: {
      isHardHidden: true,
    },
  },
  {
    key: "operationName",
    label: "Opération",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    options: data.operations.map((o: Operation) => ({
      label: o.name,
      value: o.name,
    })),
    controlOptions: {
      hidden: true,
    },
    columnOptions: {
      filterType: CONTROL_TYPES.MULTISELECT,
    },
  },
  {
    key: "fields",
    label: "Champs",
    controlType: CONTROL_TYPES.TEXTAREA,
    controlOptions: {
      hidden: true,
    },
  },
];
