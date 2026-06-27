import { ActivatedRouteSnapshot } from "@angular/router";
import { Acls } from "@core/acl/acls.model";
import { withAclConditions } from "@core/utils/field-config/acl-conditions.utils";
import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
import { CORE_CONFIG } from "@core/utils/field-config/core.config";
import { buildIdNameAction } from "@core/utils/field-config/on-select-action.config";
import { toSelectItems } from "@core/utils/primeng/to-select-items";
import {
  CONTROL_TYPES,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";
import { Resource } from "app/admin/data-access/resources/resource.model";
import { Route } from "app/admin/data-access/routes/route.model";
import { Scope } from "app/admin/data-access/scopes/scope.model";

export const SCOPE_COLUMNS: (
  payload: ActivatedRouteSnapshot,
  acls: Acls | undefined,
) => StrictCrudItemOptions<Scope>[] = ({ data }, acls) =>
  withAclConditions(
    [
      ID_CONFIG,
      CORE_CONFIG,
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
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          validators: [required, minlength(1), maxlength(50)],
        },
      },
      ...buildArchivedConfig(),
      ...buildAuditConfig(),
    ] as StrictCrudItemOptions<Scope>[],
    acls,
  );
