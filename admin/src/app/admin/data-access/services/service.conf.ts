import { ActivatedRouteSnapshot } from "@angular/router";
import { ARCHIVED_CONFIG } from "@core/utils/field-config/archived.config";
import { AUDIT_CONFIG } from "@core/utils/field-config/audit.config";
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
import { GatewayApplication } from "app/admin/data-access/applications/application.model";
import { Service } from "app/admin/data-access/services/service.model";

export const buildServiceColumns = ({
  data,
}: ActivatedRouteSnapshot): StrictCrudItemOptions<Service>[] => [
  ID_CONFIG,
  {
    key: "appId",
    label: $localize`:@@Services_Application:Application`,
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
    label: $localize`:@@Services_Application:Application`,
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
    label: $localize`:@@Services_Name:Name`,
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [required, minlength(1), maxlength(30)],
    },
  },
  {
    key: "pattern",
    label: $localize`:@@Services_Pattern:Pattern`,
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      validators: [minlength(1), maxlength(20)],
    },
  },
  CORE_CONFIG,
  ...ARCHIVED_CONFIG,
  ...AUDIT_CONFIG,
];
