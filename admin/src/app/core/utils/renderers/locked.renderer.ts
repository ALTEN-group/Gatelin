export function buildLockedCellRenderer(): (cellValue: unknown) => string {
  return (cellValue: unknown): string =>
    cellValue
      ? `<i class="pi pi-lock"></i>`
      : `<i class="pi pi-lock-open"></i>`;
}
