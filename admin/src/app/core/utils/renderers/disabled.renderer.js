const DISABLED_CELL_CLASS = "opacity-50";
export function disabledCellRenderer(cellValue) {
    return `<span class="${DISABLED_CELL_CLASS}">${cellValue ?? ""}</span>`;
}
//# sourceMappingURL=disabled.renderer.js.map