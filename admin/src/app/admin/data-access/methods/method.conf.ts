import { DomSanitizer } from "@angular/platform-browser";
import { Acls } from "@core/acl/acls.model";
import { withAclConditions } from "@core/utils/field-config/acl-conditions.utils";
import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { disabledCellRenderer } from "@core/utils/renderers/disabled.renderer";
import {
  CONTROL_TYPES,
  hexColor,
  ID_CONFIG,
  INPUT_TYPES,
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
  acls: Acls | undefined,
): StrictCrudItemOptions<Method>[] {
  return withAclConditions(
    [
      ID_CONFIG,
      {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          disabled: true,
        },
        columnOptions: {
          customCellRenderer: disabledCellRenderer,
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
    ] as StrictCrudItemOptions<Method>[],
    acls,
  );
}
