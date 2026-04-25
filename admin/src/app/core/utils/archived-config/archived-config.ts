import { ColumnOptions, createArchivedConfig } from "@dwtechs/crud-builder";

// Default archived config with "Archived" label and check for archived, times for active
export const defaultArchivedConfig = () =>
  createArchivedConfig().map((col) =>
    col.key === "archived"
      ? {
          ...col,
          ...getArchivedColumnOptions(col.columnOptions),
        }
      : col,
  );

// Archived column is renamed "Active" and the icons are inverted (check for active, times for archived)
export const customArchivedConfig = () =>
  createArchivedConfig({
    label: "Active",
    labelAt: "Archived at",
    archived: "Archived",
    active: "Active",
  }).map((col) =>
    col.key === "archived"
      ? {
          ...col,
          ...getArchivedColumnOptions(col.columnOptions, false),
        }
      : col,
  );

function getArchivedColumnOptions(
  initialColOptions: ColumnOptions | undefined,
  defaultConfig = true,
) {
  return {
    ...(initialColOptions || {}),
    customCellRenderer: (cellValue: unknown) =>
      cellValue
        ? `<i class="pi pi-times ${defaultConfig ? "green" : "red"}"></i>`
        : `<i class="pi pi-check ${defaultConfig ? "red" : "green"}"></i>`,
  };
}
