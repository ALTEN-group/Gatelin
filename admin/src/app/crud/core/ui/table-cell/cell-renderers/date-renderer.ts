import { DatePipe } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { DATE_FORMAT } from "@crud/core/utils/dates/dates.utils";

@Component({
  selector: "tbl-date-cell-renderer",
  imports: [DatePipe],
  template: `
        {{ valueAsString() | date: dateFormat }}
  `,
})
export class DateCellRendererComponent {
  public readonly cellValue = input.required<unknown>();

  public readonly valueAsString = computed(() => {
    const cellValue = this.cellValue();
    if (cellValue instanceof Date) {
      return cellValue.toISOString();
    }
    return cellValue as string | null;
  });
  public readonly dateFormat = DATE_FORMAT;
}
