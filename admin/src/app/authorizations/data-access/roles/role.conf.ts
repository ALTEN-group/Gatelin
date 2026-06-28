import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Acls } from "@core/acl/acls.model";
import { withAclConditions } from "@core/utils/field-config/acl-conditions.utils";
import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
import { buildIdNameAction } from "@core/utils/field-config/on-select-action.config";
import {
  toNamesSelectOptions,
  toSelectItems,
} from "@core/utils/primeng/to-select-items";
import { buildActiveCellRenderer } from "@core/utils/renderers/active.renderer";
import { buildColorCellRenderer } from "@core/utils/renderers/color.renderer";
import {
  CONTROL_TYPES,
  hexColor,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";
import { GatewayApplication } from "app/authorizations/data-access/applications/application.model";
import { GatewayRole } from "app/authorizations/data-access/roles/role.model";

export const buildRoleColumns = (
  sanitizer: DomSanitizer,
  { data }: ActivatedRouteSnapshot,
  acls: Acls | undefined,
): StrictCrudItemOptions<GatewayRole>[] =>
  withAclConditions(
    [
      ID_CONFIG,
      {
        key: "appId",
        label: $localize`:@@Roles_Application:Application`,
        controlType: CONTROL_TYPES.SELECT,
        options: toSelectItems<GatewayApplication>(data.applications, "name"),
        controlOptions: {
          validators: [required],
          action: buildIdNameAction<GatewayApplication>(
            "appName",
            data.applications,
            "name",
          ),
        },
        columnOptions: {
          isHardHidden: true,
        },
      },
      {
        key: "appName",
        label: $localize`:@@Roles_Application:Application`,
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        options: toNamesSelectOptions(data.applications),
        controlOptions: {
          hidden: true,
        },
        columnOptions: {
          filterType: CONTROL_TYPES.MULTISELECT,
        },
      },
      {
        key: "name",
        label: $localize`:@@Roles_Name:Name`,
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          validators: [required, minlength(1), maxlength(50)],
        },
      },
      {
        key: "description",
        label: $localize`:@@Roles_Description:Description`,
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          validators: [maxlength(100)],
        },
      },
      {
        key: "color",
        label: "Color",
        controlType: CONTROL_TYPES.COLOR,
        controlOptions: {
          inputIcon: "pi pi-palette",
          validators: [hexColor],
          defaultValue: "#6366f1",
        },
        columnOptions: {
          customCellRenderer: buildColorCellRenderer(sanitizer),
        },
      },
      {
        key: "active",
        label: $localize`:@@Roles_Active:Active`,
        controlType: CONTROL_TYPES.CHECKBOX,
        columnOptions: {
          customCellRenderer: buildActiveCellRenderer(),
        },
      },
      ...buildArchivedConfig(),
      ...buildAuditConfig(),
    ] as StrictCrudItemOptions<GatewayRole>[],
    acls,
  );
