export function buildProtectedCellRenderer(): (cellValue: unknown) => string {
  return (cellValue: unknown): string =>
    cellValue
      ? `<i class="pi pi-shield"></i>`
      : `<i class="pi pi-exclamation-circle"></i>`;
}
