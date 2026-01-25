export function checkboxCellRenderer(value: unknown) {
  return value
    ? `<i class="pi pi-check green"></i>`
    : `<i class="pi pi-times red"></i>`;
}
