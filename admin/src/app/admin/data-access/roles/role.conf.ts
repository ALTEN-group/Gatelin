import { DomSanitizer } from "@angular/platform-browser";
import { buildColorCellRenderer } from "@core/utils/renderers/color.renderer";
import {
  CONTROL_TYPES,
  createArchivedConfig,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";
import { GatewayRole } from "app/admin/data-access/roles/role.model";

export function buildRoleColumns(
  sanitizer: DomSanitizer,
): StrictCrudItemOptions<GatewayRole>[] {
  return [
    ID_CONFIG,
    {
      key: "name",
      label: "Nom",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      controlOptions: {
        validators: [required, minlength(1), maxlength(50)],
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
      key: "color",
      label: "Couleur",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      columnOptions: {
        customCellRenderer: buildColorCellRenderer(sanitizer),
      },
    },
    {
      key: "active",
      label: "Actif",
      controlType: CONTROL_TYPES.CHECKBOX,
    },
    ...createArchivedConfig(),
  ];
}
