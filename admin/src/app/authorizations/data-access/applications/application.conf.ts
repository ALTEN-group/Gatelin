import { Acls } from "@core/acl/acls.model";
import { withAclConditions } from "@core/utils/field-config/acl-conditions.utils";
import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { CORE_CONFIG } from "@core/utils/field-config/core.config";
import {
  CONTROL_TYPES,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/ngx-crud-builder";
import { GatewayApplication } from "app/authorizations/data-access/applications/application.model";

export function buildApplicationColumns(
  acls: Acls | undefined,
): StrictCrudItemOptions<GatewayApplication>[] {
  return withAclConditions(
    [
      ID_CONFIG,
      CORE_CONFIG,
      {
        key: "name",
        label: $localize`:@@Applications_Name:Name`,
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          validators: [required, minlength(1), maxlength(50)],
        },
      },
      {
        key: "description",
        label: $localize`:@@Applications_Description:Description`,
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          validators: [maxlength(100)],
        },
      },
      ...buildArchivedConfig(),
    ] as StrictCrudItemOptions<GatewayApplication>[],
    acls,
  );
}
