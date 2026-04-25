import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRouteSnapshot } from "@angular/router";
import { defaultArchivedConfig } from "@core/utils/archived-config/archived-config";
import { toSelectItems } from "@core/utils/primeng/to-select-items";
import { buildColorCellRenderer } from "@core/utils/renderers/color.renderer";
import {
  CONTROL_TYPES,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";
import { GatewayApplication } from "app/admin/data-access/applications/application.model";
import { GatewayRole } from "app/admin/data-access/roles/role.model";

export const buildRoleColumns = (
  sanitizer: DomSanitizer,
  { data }: ActivatedRouteSnapshot,
): StrictCrudItemOptions<GatewayRole>[] => [
  ID_CONFIG,
  {
    key: "appId",
    label: $localize`:@@Roles_Application:Application`,
    controlType: CONTROL_TYPES.SELECT,
    options: toSelectItems<GatewayApplication>(data.applications, "name"),
    controlOptions: {
      validators: [required],
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
    label: $localize`:@@Roles_Color:Couleur`,
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    columnOptions: {
      customCellRenderer: buildColorCellRenderer(sanitizer),
    },
  },
  {
    key: "active",
    label: $localize`:@@Roles_Active:Actif`,
    controlType: CONTROL_TYPES.CHECKBOX,
  },
  ...defaultArchivedConfig(),
];
