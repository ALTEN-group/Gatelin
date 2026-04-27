import { createArchivedConfig } from "@dwtechs/crud-builder";

const archivedRenderer = (v: unknown) =>
  v
    ? `<i class="pi pi-check-circle"></i>`
    : `<i class="pi pi-circle muted"></i>`;

// Default archived config with "Archived" label and check for archived, times for active
export const ARCHIVED_CONFIG = createArchivedConfig().map((col) =>
  col.key === "archived"
    ? {
        ...col,
        label: "🗄️",
        columnOptions: {
          ...(col.columnOptions || {}),
          defaultWidth: "60px",
          customCellRenderer: archivedRenderer,
        },
      }
    : col,
);
