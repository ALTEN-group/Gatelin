export function buildProtectedCellRenderer() {
    return (cellValue) => cellValue
        ? `<i class="pi pi-shield"></i>`
        : `<i class="pi pi-exclamation-circle"></i>`;
}
//# sourceMappingURL=protected.renderer.js.map