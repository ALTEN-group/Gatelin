export function buildActiveCellRenderer(): (cellValue: unknown) => string {
  return (cellValue: unknown): string =>
    cellValue
      ? `<i class="pi pi-check-circle"></i>`
      : `<i class="pi pi-times-circle"></i>`;
}
