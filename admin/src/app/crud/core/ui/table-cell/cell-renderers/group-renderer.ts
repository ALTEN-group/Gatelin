import { SlicePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { isNil, isObject } from "@dwtechs/checkard";

@Component({
  selector: "tbl-group-cell-renderer",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlicePipe],
  template: `
    <span class="single-line-text">
      {{ value() | slice:0:20 }}
      @if (value().length > 20) {
        <span>...</span>
      }
    </span>
  `,
  styles: [
    `
    .single-line-text {
      display: flex;
      white-space: nowrap;
      align-items: center;
    }
  `,
  ],
})
export class GroupCellRendererComponent {
  public readonly cellValue = input.required<unknown>();

  public readonly value = computed(() => this.groupCellRenderer());

  private groupCellRenderer(): string {
    const cellValue = this.cellValue();
    if (!isObject(cellValue)) {
      return "";
    }
    const information: string[] = [];
    const entries = Object.entries(cellValue);
    for (const [, val] of entries) {
      if (!isNil(val)) {
        information.push(`${val}`);
      }
    }
    return information.join(", ");
  }
}
