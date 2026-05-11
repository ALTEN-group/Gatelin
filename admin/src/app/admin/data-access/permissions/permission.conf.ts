import { inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRouteSnapshot } from "@angular/router";
import {
  buildIdNameAction,
  buildIdsNamesAction,
} from "@core/utils/field-config/on-select-action.config";
import { toSelectItems } from "@core/utils/primeng/to-select-items";
import { buildColoredChipsCellRenderer } from "@core/utils/renderers/colored-chips.renderer";
import {
  CONTROL_TYPES,
  ID_CONFIG,
  INPUT_TYPES,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";
import { Condition } from "app/admin/data-access/conditions/condition.model";
import { Operation } from "app/admin/data-access/operations/operation.model";
import { Permission } from "app/admin/data-access/permissions/permission.model";
import { Resource } from "app/admin/data-access/resources/resource.model";
import { Route } from "app/admin/data-access/routes/route.model";
import { Service } from "app/admin/data-access/services/service.model";

export const PERMISSION_COLUMNS: (
  payload: ActivatedRouteSnapshot,
) => StrictCrudItemOptions<Permission>[] = ({ data }) => {
  const sanitizer = inject(DomSanitizer);
  const operationLookup = (name: string) => {
    const op = (data.operations as Operation[]).find((o) => o.name === name);
    return op ? { label: op.name, color: op.color } : undefined;
  };
  const conditionLookup = (name: unknown) => {
    const cond = (data.conditions as Condition[]).find(
      (c) => c.name === String(name),
    );
    return cond ? { label: cond.name, color: cond.color } : undefined;
  };

  return [
    ID_CONFIG,
    {
      key: "serviceId",
      label: "Service",
      controlType: CONTROL_TYPES.SELECT,
      options: toSelectItems<Service>(data.services, "name"),
      controlOptions: {
        action: buildIdNameAction<Service>(
          "serviceName",
          data.services,
          "name",
        ),
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
        action: buildIdNameAction<Resource>(
          "resourceName",
          data.resources,
          "name",
        ),
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
      key: "routeId",
      label: "Route",
      controlType: CONTROL_TYPES.SELECT,
      options: toSelectItems<Route>(data.routes, "name"),
      controlOptions: {
        validators: [required],
        action: buildIdNameAction<Route>("routeName", data.routes, "name"),
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
      label: "Operations",
      controlType: CONTROL_TYPES.MULTISELECT,
      options: toSelectItems<Operation>(data.operations, "name"),
      controlOptions: {
        validators: [required],
        action: buildIdsNamesAction<Operation>(
          "operationName",
          data.operations,
          "name",
        ),
      },
      columnOptions: {
        isHardHidden: true,
      },
    },
    {
      key: "operationName",
      label: "Operations",
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
        customCellRenderer: buildColoredChipsCellRenderer(
          sanitizer,
          operationLookup,
        ),
      },
    },
    {
      key: "fields",
      label: "Fields",
      controlType: CONTROL_TYPES.TEXTAREA,
      controlOptions: {
        hidden: true,
      },
      columnOptions: {
        valueAsChip: true,
        defaultWidth: "200px",
      },
    },
    {
      key: "scopes",
      label: "Scopes",
      controlType: CONTROL_TYPES.TEXTAREA,
      controlOptions: {
        hidden: true,
      },
      columnOptions: {
        valueAsChip: true,
        defaultWidth: "200px",
      },
    },
    {
      key: "conditionId",
      label: "Conditions",
      controlType: CONTROL_TYPES.MULTISELECT,
      options: toSelectItems<Condition>(data.conditions, "name"),
      controlOptions: {
        action: buildIdsNamesAction<Condition>(
          "conditionName",
          data.conditions,
          "name",
        ),
      },
    },
    {
      key: "conditionName",
      label: "Conditions",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      options: data.conditions.map((c: Condition) => ({
        label: c.name,
        value: c.name,
      })),
      controlOptions: {
        hidden: true,
      },
      columnOptions: {
        filterType: CONTROL_TYPES.MULTISELECT,
        customCellRenderer: buildColoredChipsCellRenderer(
          sanitizer,
          conditionLookup,
        ),
        defaultWidth: "200px",
      },
    },
  ];
};
