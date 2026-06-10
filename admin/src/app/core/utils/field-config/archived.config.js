import { inject } from "@angular/core";
import { CRUD_LABELS, createArchivedConfig } from "@dwtechs/crud-builder";
const archivedRenderer = (v) => v
    ? `<i class="pi pi-check-circle"></i>`
    : `<i class="pi pi-circle muted"></i>`;
export function buildArchivedConfig() {
    const labels = inject(CRUD_LABELS);
    return createArchivedConfig(labels.archivedConfig).map((col) => col.key === "archived"
        ? {
            ...col,
            columnOptions: {
                ...(col.columnOptions || {}),
                defaultWidth: "60px",
                customCellRenderer: archivedRenderer,
                customHeaderRenderer: () => "🗄️",
            },
        }
        : col);
}
//# sourceMappingURL=archived.config.js.map