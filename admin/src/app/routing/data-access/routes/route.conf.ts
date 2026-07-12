import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Acls } from "@core/acl/acls.model";
import { withAclConditions } from "@core/utils/field-config/acl-conditions.utils";
import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
import { CORE_CONFIG } from "@core/utils/field-config/core.config";
import {
  buildIdNameAction,
  buildIdsNamesAction,
} from "@core/utils/field-config/on-select-action.config";
import { PROTECTED_CONFIG } from "@core/utils/field-config/protected.config";
import {
  toNamesSelectOptions,
  toSelectItems,
} from "@core/utils/primeng/to-select-items";
import { buildColoredChipsCellRenderer } from "@core/utils/renderers/colored-chips.renderer";
import {
  CONTROL_TYPES,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";
import { Method } from "app/routing/data-access/methods/method.model";
import { Operation } from "app/routing/data-access/operations/operation.model";
import { Resource } from "app/routing/data-access/resources/resource.model";
import { Route } from "app/routing/data-access/routes/route.model";
import { Service } from "app/routing/data-access/services/service.model";

export const ROUTE_COLUMNS: (
  payload: ActivatedRouteSnapshot,
  sanitizer: DomSanitizer,
  acls: Acls | undefined,
) => StrictCrudItemOptions<Route>[] = ({ data }, sanitizer, acls) => {
  return withAclConditions(
    [
      ID_CONFIG,
      {
        key: "serviceId",
        label: "Service",
        controlType: CONTROL_TYPES.SELECT,
        options: toSelectItems<Service>(data.services, "name"),
        controlOptions: {
          validators: [required],
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
        options: toNamesSelectOptions(data.services),
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
          action: buildIdNameAction<Resource>(
            "resourceName",
            data.resources,
            "name",
          ),
        },
        columnOptions: {
          isHardHidden: true,
        },
        conditions: {
          options: ({ model }) =>
            toSelectItems<Resource>(
              data.resources.filter(
                (r: Resource) => r.serviceId === model.serviceId,
              ),
              "name",
            ),
        },
      },
      {
        key: "resourceName",
        label: "Resource",
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        options: toNamesSelectOptions(data.resources),
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
          validators: [minlength(1), maxlength(40)],
        },
        columnOptions: {
          customCellRenderer: (cellValue: unknown): string =>
            typeof cellValue === "string" && cellValue ? cellValue : "/",
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
        controlType: CONTROL_TYPES.MULTISELECT,
        options: toNamesSelectOptions(data.operations),
        controlOptions: {
          hidden: true,
        },
        columnOptions: {
          customCellRenderer: buildColoredChipsCellRenderer(
            sanitizer,
            (name) => {
              const op = (data.operations as Operation[]).find(
                (o) => o.name === name,
              );
              return op ? { label: op.name, color: op.color } : undefined;
            },
          ),
          tooltip: (value) => (value as string[]).join(", "),
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
        options: toSelectItems<Method>(data.methods, "name"),
        controlOptions: {
          validators: [required],
          action: buildIdsNamesAction<Method>(
            "methodNames",
            data.methods,
            "name",
          ),
        },
        columnOptions: {
          isHardHidden: true,
        },
      },
      {
        key: "methodNames",
        label: "Methods",
        controlType: CONTROL_TYPES.SELECT,
        options: toNamesSelectOptions(data.methods),
        controlOptions: {
          hidden: true,
        },
        columnOptions: {
          filterType: CONTROL_TYPES.MULTISELECT,
          customCellRenderer: buildColoredChipsCellRenderer(
            sanitizer,
            (name) => {
              const method = (data.methods as Method[]).find(
                (m) => m.name === name,
              );
              return method
                ? { label: method.name, color: method.color }
                : undefined;
            },
          ),
          tooltip: (value) => (value as string[]).join(", "),
        },
      },
      PROTECTED_CONFIG,
      CORE_CONFIG,
      ...buildArchivedConfig(),
      ...buildAuditConfig(),
    ] as StrictCrudItemOptions<Route>[],
    acls,
  );
};
