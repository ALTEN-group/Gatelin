const DISABLED_CELL_CLASS = "opacity-50";

export function disabledCellRenderer(cellValue: unknown): string {
  return `<span class="${DISABLED_CELL_CLASS}">${cellValue ?? ""}</span>`;
}
