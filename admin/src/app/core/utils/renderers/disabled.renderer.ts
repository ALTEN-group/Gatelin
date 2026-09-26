import { isBoolean, isNumber, isString } from "@dwtechs/checkard";

const DISABLED_CELL_CLASS = "opacity-50";

export function disabledCellRenderer(cellValue: unknown): string {
  const value =
    isString(cellValue) || isNumber(cellValue) || isBoolean(cellValue)
      ? String(cellValue)
      : "";
  return `<span class="${DISABLED_CELL_CLASS}">${value}</span>`;
}
