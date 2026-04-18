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

const CHIP_COLORS = [
  "blue",
  "orange",
  "red",
  "indigo",
  "cyan",
  "purple",
  "burgundy",
  "green",
  "yellow",
];

function buildOperationChipRenderer(
  operations: Operation[],
): (cellValue: unknown) => string {
  const colorMap = new Map<string, string>(
    operations.map((op, i) => [op.name, CHIP_COLORS[i % CHIP_COLORS.length]]),
  );
  return (cellValue: unknown) => {
    const name = String(cellValue ?? "");
    const color = colorMap.get(name) ?? "";
    const escapedName = name.replace(
      /[<>&"']/g,
      (c) =>
        ({
          "<": "&lt;",
          ">": "&gt;",
          "&": "&amp;",
          '"': "&quot;",
          "'": "&#39;",
        })[c] ?? c,
    );
    return `<span class="p-chip${color ? ` ${color}` : ""}">${escapedName}</span>`;
  };
}

export const PERMISSION_COLUMNS: (
  payload: ActivatedRouteSnapshot,
) => StrictCrudItemOptions<Permission>[] = ({ data }) => [
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
    key: "operationId",
    label: "Operation",
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
    label: "Operation",
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
      customCellRenderer: buildOperationChipRenderer(data.operations),
    },
  },
  {
    key: "fields",
    label: "Fields",
    controlType: CONTROL_TYPES.TEXTAREA,
    controlOptions: {
      hidden: true,
    },
  },
];
