import { buildArchivedConfig } from "@core/utils/field-config/archived.config";
import { disabledCellRenderer } from "@core/utils/renderers/disabled.renderer";
import { CONTROL_TYPES, ID_CONFIG, INPUT_TYPES, } from "@dwtechs/crud-builder";
const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{3,8}$/;
function buildColorCellRenderer(sanitizer) {
    return (cellValue) => {
        const hex = String(cellValue ?? "").trim();
        if (!HEX_COLOR_REGEX.test(hex))
            return "";
        const html = `<span style="display:inline-flex;align-items:center;gap:0.5rem;"><span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:${hex};border:1px solid rgba(0,0,0,0.15);flex-shrink:0;"></span><span>${hex}</span></span>`;
        return sanitizer.bypassSecurityTrustHtml(html);
    };
}
export function buildMethodColumns(sanitizer) {
    return [
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
            label: "Couleur",
            controlType: CONTROL_TYPES.INPUT,
            type: INPUT_TYPES.TEXT,
            columnOptions: {
                customCellRenderer: buildColorCellRenderer(sanitizer),
            },
        },
        ...buildArchivedConfig(),
    ];
}
//# sourceMappingURL=method.conf.js.map