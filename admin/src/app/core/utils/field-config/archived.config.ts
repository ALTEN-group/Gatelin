import {
  ColumnOptions,
  CONTROL_TYPES,
  createArchivedConfig,
  INPUT_TYPES,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";

export interface ArchivedColumnWidths {
  archived?: string;
  archivedAt?: string;
}

// Default archived config with "Archived" label and check for archived, times for active
export const defaultArchivedConfig = (widths: ArchivedColumnWidths = {}) =>
  createArchivedConfig().map((col) =>
    col.key === "archived"
      ? {
          ...col,
          ...getArchivedColumnOptions(col.columnOptions),
          ...(widths.archived
            ? {
                columnOptions: {
                  ...col.columnOptions,
                  ...getArchivedColumnOptions(col.columnOptions),
                  defaultWidth: widths.archived,
                },
              }
            : {}),
        }
      : {
          ...col,
          ...(widths.archivedAt
            ? {
                columnOptions: {
                  ...(col.columnOptions || {}),
                  defaultWidth: widths.archivedAt,
                },
              }
            : {}),
        },
  );

// Archived column is renamed "Active" and the icons are inverted (check for active, times for archived)
export const customArchivedConfig = (widths: ArchivedColumnWidths = {}) =>
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
          ...(widths.archived
            ? {
                columnOptions: {
                  ...col.columnOptions,
                  ...getArchivedColumnOptions(col.columnOptions, false),
                  defaultWidth: widths.archived,
                },
              }
            : {}),
        }
      : {
          ...col,
          ...(widths.archivedAt
            ? {
                columnOptions: {
                  ...(col.columnOptions || {}),
                  defaultWidth: widths.archivedAt,
                },
              }
            : {}),
        },
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

export const auditConfig = <T>(): StrictCrudItemOptions<T>[] =>
  [
    {
      key: "createdAt" as keyof T,
      label: "Créé le",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      controlOptions: { hidden: true },
      columnOptions: { isSoftHidden: true },
    },
    {
      key: "creatorName" as keyof T,
      label: "Créé par",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      controlOptions: { hidden: true },
      columnOptions: { isSoftHidden: true },
    },
    {
      key: "updatedAt" as keyof T,
      label: "Modifié le",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      controlOptions: { hidden: true },
      columnOptions: { isSoftHidden: true },
    },
    {
      key: "updaterName" as keyof T,
      label: "Modifié par",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      controlOptions: { hidden: true },
      columnOptions: { isSoftHidden: true },
    },
  ] as StrictCrudItemOptions<T>[];
