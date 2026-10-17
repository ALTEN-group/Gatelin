import { Validators } from "@angular/forms";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Acls } from "@core/acl/acls.model";
import { withAclConditions } from "@core/utils/field-config/acl-conditions.utils";
import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
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
import { Service } from "app/routing/data-access/services/service.model";

export const buildServiceColumns = (
  _route: ActivatedRouteSnapshot,
  acls: Acls | undefined,
): StrictCrudItemOptions<Service>[] => {
  return withAclConditions<Service>(
    [
      ID_CONFIG,
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
      {
        key: "forwardedCookies",
        label: $localize`:@@Services_ForwardedCookies:Forwarded cookies`,
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          isFormArray: true,
          controlArrayConfig: { maxItems: 20 },
          helpText: $localize`:@@Services_ForwardedCookies_Help:Cookies forwarded to this service. Gatelin session cookies are never forwarded.`,
          validators: [
            required,
            maxlength(64),
            Validators.pattern(/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/),
          ],
          width: "100%",
        },
        columnOptions: {
          valueAsChip: true,
          defaultWidth: "200px",
        },
      },
      CORE_CONFIG,
      ...buildArchivedConfig(),
      ...buildAuditConfig(),
    ],
    acls,
  );
};
