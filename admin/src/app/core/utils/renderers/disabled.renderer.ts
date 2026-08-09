const DISABLED_CELL_CLASS = "opacity-50";

export function disabledCellRenderer(cellValue: unknown): string {
  const value =
    typeof cellValue === "string" ||
    typeof cellValue === "number" ||
    typeof cellValue === "boolean"
      ? String(cellValue)
      : "";
  return `<span class="${DISABLED_CELL_CLASS}">${value}</span>`;
}
