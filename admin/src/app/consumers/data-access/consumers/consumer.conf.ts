import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Acls } from "@core/acl/acls.model";
import { withAclConditions } from "@core/utils/field-config/acl-conditions.utils";
import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
import { buildColoredChipsCellRenderer } from "@core/utils/renderers/colored-chips.renderer";
import {
  CONTROL_TYPES,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  min,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/ngx-crud-builder";
import { GatelinRole } from "app/authorizations/data-access/roles/role.model";
import { Consumer } from "app/consumers/data-access/consumers/consumer.model";

export const CONSUMER_COLUMNS: (
  payload: ActivatedRouteSnapshot,
  acls: Acls | undefined,
  sanitizer: DomSanitizer,
) => StrictCrudItemOptions<Consumer>[] = ({ data }, acls, sanitizer) => {
  const activeRoles = (data.roles as GatelinRole[]).filter(
    (role) => !role.archived,
  );
  return withAclConditions(
    [
      ID_CONFIG,
      {
        key: "userId",
        label: "User ID",
        controlType: CONTROL_TYPES.INPUT,
        columnOptions: {
          defaultWidth: "80px",
        },
        type: INPUT_TYPES.NUMBER,
        controlOptions: {
          validators: [required, min(1)],
        },
      },
      {
        key: "nickname",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
        columnOptions: {
          defaultWidth: "100px",
        },
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          validators: [required, minlength(3), maxlength(30)],
        },
      },
      {
        key: "accessToken",
        label: "Access Token",
        controlType: CONTROL_TYPES.INPUT,
        columnOptions: {
          defaultWidth: "100px",
        },
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          validators: [required, minlength(28), maxlength(8000)],
        },
      },
      {
        key: "refreshToken",
        label: "Refresh Token",
        controlType: CONTROL_TYPES.INPUT,
        columnOptions: {
          defaultWidth: "100px",
        },
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          validators: [required, minlength(28), maxlength(8000)],
        },
      },
      {
        key: "roles",
        label: "Roles",
        controlType: CONTROL_TYPES.MULTISELECT,
        options: activeRoles.map((r) => ({
          value: r.id,
          label: r.name,
          styleClass: `role-color-${r.id}`,
          color: r.color || null,
        })),
        columnOptions: {
          customCellRenderer: buildColoredChipsCellRenderer(
            sanitizer,
            (value: unknown) => {
              const role = activeRoles.find((r) => r.id === Number(value));
              if (!role) return undefined;
              return {
                label: role.name,
                color: role.color || null,
              };
            },
          ),
        },
        controlOptions: {
          validators: [required],
          width: "100%",
        },
      },
      ...buildArchivedConfig(),
      ...buildAuditConfig().filter(
        (field) => field.key !== "creatorName" && field.key !== "updaterName",
      ),
    ] as StrictCrudItemOptions<Consumer>[],
    acls,
  );
};
