import { Component, input } from "@angular/core";

@Component({
  selector: "tbl-checkbox-cell-renderer",
  template: `
    @if (cellValue()) {
        <i class="pi pi-check green"></i>
    } @else {
        <i class="pi pi-times red"></i>
    }
`,
})
export class CheckboxCellRendererComponent {
  public readonly cellValue = input.required<unknown>();
}
