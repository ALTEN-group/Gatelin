import { DomSanitizer } from "@angular/platform-browser";
import { ARCHIVED_CONFIG } from "@core/utils/field-config/archived.config";
import {
  CONTROL_TYPES,
  ID_CONFIG,
  INPUT_TYPES,
  maxlength,
  minlength,
  required,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";
import { Method } from "app/admin/data-access/methods/method.model";

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{3,8}$/;

function buildColorCellRenderer(
  sanitizer: DomSanitizer,
): (cellValue: unknown) => string {
  return (cellValue: unknown): string => {
    const hex = String(cellValue ?? "").trim();
    if (!HEX_COLOR_REGEX.test(hex)) return "";
    const html = `<span style="display:inline-flex;align-items:center;gap:0.5rem;"><span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:${hex};border:1px solid rgba(0,0,0,0.15);flex-shrink:0;"></span><span>${hex}</span></span>`;
    return sanitizer.bypassSecurityTrustHtml(html) as unknown as string;
  };
}

export function buildMethodColumns(
  sanitizer: DomSanitizer,
): StrictCrudItemOptions<Method>[] {
  return [
    ID_CONFIG,
    {
      key: "name",
      label: "Name",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      controlOptions: {
        validators: [required, minlength(1), maxlength(10)],
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
  ];
}
