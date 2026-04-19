import { ActivatedRouteSnapshot } from "@angular/router";
import { toSelectItems } from "@core/utils/primeng/to-select-items";
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
import { Method } from "app/admin/data-access/methods/method.model";
import { Operation } from "app/admin/data-access/operations/operation.model";
import { Resource } from "app/admin/data-access/resources/resource.model";
import { Route } from "app/admin/data-access/routes/route.model";
import { Service } from "app/admin/data-access/services/service.model";

function buildMethodChipRenderer(
  methods: Method[],
): (cellValue: unknown) => string {
  const colorMap = new Map<string, string | null>(
    methods.map((m) => [m.name, m.color]),
  );
  return (cellValue: unknown) => {
    let names: string[];
    if (Array.isArray(cellValue)) {
      names = cellValue as string[];
    } else {
      const raw = String(cellValue ?? "").trim();
      // Handle PostgreSQL array literal: {GET,POST,OPTIONS}
      const pgArray = raw.match(/^\{(.*)\}$/);
      names = pgArray
        ? pgArray[1]
            .split(",")
            .map((n) => n.trim())
            .filter(Boolean)
        : raw
            .split(", ")
            .map((n) => n.trim())
            .filter(Boolean);
    }
    return names
      .map((name) => {
        const color = colorMap.get(name);
        const style = color ? ` style="background:${color};color:#fff"` : "";
        const escaped = name.replace(
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
        return `<span class="p-chip"${style}>${escaped}</span>`;
      })
      .join(" ");
  };
}

function buildOperationChipRenderer(
  operations: Operation[],
): (cellValue: unknown) => string {
  const colorMap = new Map<string, string | null>(
    operations.map((op) => [op.name, op.color]),
  );
  return (cellValue: unknown) => {
    const names = String(cellValue ?? "")
      .split(", ")
      .map((n) => n.trim())
      .filter(Boolean);
    return names
      .map((name) => {
        const color = colorMap.get(name);
        const style = color ? ` style="background:${color};color:#fff"` : "";
        const escaped = name.replace(
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
        return `<span class="p-chip"${style}>${escaped}</span>`;
      })
      .join(" ");
  };
}

export const ROUTE_COLUMNS: (
  payload: ActivatedRouteSnapshot,
) => StrictCrudItemOptions<Route>[] = ({ data }) => [
  ID_CONFIG,
  {
    key: "serviceId",
    label: "Service",
    controlType: CONTROL_TYPES.SELECT,
    options: toSelectItems<Service>(data.services, "name"),
    controlOptions: {
      validators: [required],
    },
    columnOptions: {
      isHardHidden: true,
    },
  },
  {
    key: "serviceName",
    label: "Service",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    options: data.services.map((s: Service) => ({
      label: s.name,
      value: s.name,
    })),
    controlOptions: {
      hidden: true,
    },
    columnOptions: {
      filterType: CONTROL_TYPES.MULTISELECT,
    },
  },
  {
    key: "resourceId",
    label: "Resource",
    controlType: CONTROL_TYPES.SELECT,
    options: toSelectItems<Resource>(data.resources, "name"),
    controlOptions: {
      validators: [required],
    },
    columnOptions: {
      isHardHidden: true,
    },
  },
  {
    key: "resourceName",
    label: "Resource",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    options: data.resources.map((r: Resource) => ({
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
    key: "pattern",
    label: "Pattern",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [required, minlength(1), maxlength(40)],
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
    key: "name",
    label: "Name",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [required, maxlength(50)],
    },
  },
  {
    key: "description",
    label: "Description",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [required, maxlength(100)],
    },
  },
  {
    key: "methodIds",
    label: "Methods",
    controlType: CONTROL_TYPES.MULTISELECT,
    options: data.methods.map((m: Method) => ({
      label: m.name,
      value: m.id,
    })),
    controlOptions: {
      validators: [required],
    },
    columnOptions: {
      isHardHidden: true,
    },
  },
  {
    key: "methodNames",
    label: "Methods",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    options: data.methods.map((m: Method) => ({
      label: m.name,
      value: m.name,
    })),
    controlOptions: {
      hidden: true,
    },
    columnOptions: {
      filterType: CONTROL_TYPES.MULTISELECT,
      customCellRenderer: buildMethodChipRenderer(data.methods),
    },
  },
  {
    key: "isProtected",
    label: "Protected",
    controlType: CONTROL_TYPES.CHECKBOX,
  },
  {
    key: "locked",
    label: "Locked",
    controlType: CONTROL_TYPES.CHECKBOX,
  },
  ...createArchivedConfig(),
];
