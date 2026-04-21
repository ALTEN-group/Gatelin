import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRouteSnapshot } from "@angular/router";
import { toSelectItems } from "@core/utils/primeng/to-select-items";
import { buildColoredChipsCellRenderer } from "@core/utils/renderers/colored-chips.renderer";
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

export const ROUTE_COLUMNS: (
  payload: ActivatedRouteSnapshot,
  sanitizer: DomSanitizer,
) => StrictCrudItemOptions<Route>[] = ({ data }, sanitizer) => {
  return [
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
      controlType: CONTROL_TYPES.MULTISELECT,
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
      controlType: CONTROL_TYPES.SELECT,
      options: data.operations.map((o: Operation) => ({
        label: o.name,
        value: o.name,
      })),
      controlOptions: {
        hidden: true,
      },
      columnOptions: {
        filterType: CONTROL_TYPES.MULTISELECT,
        customCellRenderer: buildColoredChipsCellRenderer(sanitizer, (name) => {
          const op = (data.operations as Operation[]).find(
            (o) => o.name === name,
          );
          return op ? { label: op.name, color: op.color } : undefined;
        }),
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
      controlType: CONTROL_TYPES.SELECT,
      options: data.methods.map((m: Method) => ({
        label: m.name,
        value: m.name,
      })),
      controlOptions: {
        hidden: true,
      },
      columnOptions: {
        filterType: CONTROL_TYPES.MULTISELECT,
        customCellRenderer: buildColoredChipsCellRenderer(sanitizer, (name) => {
          const method = (data.methods as Method[]).find(
            (m) => m.name === name,
          );
          return method
            ? { label: method.name, color: method.color }
            : undefined;
        }),
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
};
