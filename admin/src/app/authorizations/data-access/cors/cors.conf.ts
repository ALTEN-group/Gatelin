import { Acls } from "@core/acl/acls.model";
import { withAclConditions } from "@core/utils/field-config/acl-conditions.utils";
import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
import {
  CONTROL_TYPES,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/ngx-crud-builder";
import { Cors } from "app/authorizations/data-access/cors/cors.model";

export const CORS_COLUMNS: (
  acls: Acls | undefined,
) => StrictCrudItemOptions<Cors>[] = (acls) =>
  withAclConditions(
    [
      ID_CONFIG,
      {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          validators: [required, minlength(1), maxlength(50)],
          minWidth: "100%",
        },
      },
      {
        key: "description",
        label: "Description",
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          validators: [maxlength(100)],
        },
      },
      {
        key: "credentials",
        label: "Credentials",
        controlType: CONTROL_TYPES.CHECKBOX,
        controlOptions: {},
      },
      ...buildArchivedConfig(),
      ...buildAuditConfig(),
    ] as StrictCrudItemOptions<Cors>[],
    acls,
  );
