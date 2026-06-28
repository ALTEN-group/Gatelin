import { DomSanitizer } from "@angular/platform-browser";
import { Acls } from "@core/acl/acls.model";
import { withAclConditions } from "@core/utils/field-config/acl-conditions.utils";
import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
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
import { Operation } from "app/routing/data-access/operations/operation.model";

export function buildOperationColumns(
  sanitizer: DomSanitizer,
  acls: Acls | undefined,
): StrictCrudItemOptions<Operation>[] {
  return withAclConditions<Operation>(
    [
      ID_CONFIG,
      {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          validators: [required, minlength(1), maxlength(50)],
        },
      },
      {
        key: "description",
        label: "Description",
        controlType: CONTROL_TYPES.TEXTAREA,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          validators: [maxlength(1000)],
          minWidth: "100%",
        },
        columnOptions: {
          filterType: CONTROL_TYPES.INPUT,
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
      ...buildArchivedConfig(),
      ...buildAuditConfig(),
    ],
    acls,
  );
}
