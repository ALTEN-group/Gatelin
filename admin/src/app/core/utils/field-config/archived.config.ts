import { createArchivedConfig } from "@dwtechs/crud-builder";

const archivedRenderer = (v: unknown) =>
  v ? `<i class="pi pi-times green"></i>` : `<i class="pi pi-check red"></i>`;

const activeRenderer = (v: unknown) =>
  v ? `<i class="pi pi-times red"></i>` : `<i class="pi pi-check green"></i>`;

// Default archived config with "Archived" label and check for archived, times for active
export const ARCHIVED_CONFIG = createArchivedConfig().map((col) =>
  col.key === "archived"
    ? {
        ...col,
        columnOptions: {
          ...(col.columnOptions || {}),
          customCellRenderer: archivedRenderer,
        },
      }
    : col,
);

// Archived column is renamed "Active" and the icons are inverted (check for active, times for archived)
export const ACTIVE_CONFIG = createArchivedConfig({
  label: "Active",
  labelAt: "Archived at",
  archived: "Archived",
  active: "Active",
}).map((col) => ({
  ...col,
  columnOptions: {
    ...(col.columnOptions || {}),
    defaultWidth: "80px",
    ...(col.key === "archived" ? { customCellRenderer: activeRenderer } : {}),
  },
}));
