import { DomSanitizer } from "@angular/platform-browser";
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
import { Operation } from "app/admin/data-access/operations/operation.model";

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

export function buildOperationColumns(
  sanitizer: DomSanitizer,
): StrictCrudItemOptions<Operation>[] {
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
    ...createArchivedConfig(),
  ];
}
