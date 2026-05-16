import { DomSanitizer } from "@angular/platform-browser";
import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { buildAuditConfig } from "@core/utils/field-config/audit.config";
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
      label: "Couleur",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      columnOptions: {
        customCellRenderer: buildColorCellRenderer(sanitizer),
      },
    },
    ...buildArchivedConfig(),
    ...buildAuditConfig(),
  ];
}
