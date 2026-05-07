import { CrudItemBase } from "@dwtechs/crud-builder";

const DISABLED_CELL_CLASS = "opacity-50";
const DISABLED_OPACITY = "0.5";
const ARCHIVED_OPACITY = "0.2";

export function disabledCellRenderer(cellValue: unknown): string {
  return `<span class="${DISABLED_CELL_CLASS}">${cellValue ?? ""}</span>`;
}

export function disabledRowRenderer(
  row: CrudItemBase,
  isUpdateEnabled: boolean,
): Record<string, string> {
  const isLockedOrCore = (row as any).locked || (row as any).core;
  if (isLockedOrCore) {
    return {
      opacity: DISABLED_OPACITY,
    };
  }
  return {
    opacity: row.archived
      ? ARCHIVED_OPACITY
      : isUpdateEnabled
        ? "1"
        : DISABLED_OPACITY,
  };
}
