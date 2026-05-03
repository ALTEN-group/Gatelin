import { DomSanitizer } from "@angular/platform-browser";
import { ARCHIVED_CONFIG } from "@core/utils/field-config/archived.config";
import { AUDIT_CONFIG } from "@core/utils/field-config/audit.config";
import { CORE_CONFIG } from "@core/utils/field-config/core.config";
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
import { Operation } from "app/admin/data-access/operations/operation.model";

export function buildOperationColumns(
  sanitizer: DomSanitizer,
): StrictCrudItemOptions<Operation>[] {
  return [
    ID_CONFIG,
    CORE_CONFIG,
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
      controlOptions: {
        validators: [maxlength(1000)],
        minWidth: "100%",
      },
    },
    {
      key: "color",
      label: "Couleur",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      columnOptions: {
        customCellRenderer: buildColorCellRenderer(sanitizer),
      },
    },
    ...ARCHIVED_CONFIG,
    ...AUDIT_CONFIG,
  ];
}
