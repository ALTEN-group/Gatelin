import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { CellTextContent } from "@crud/core/utils/table/cell-text-content.class";

@Component({
  selector: "tbl-table-cell-tooltip",
  templateUrl: "./table-cell-tooltip.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class TableCellTooltipComponent {
  public readonly cellValue = input.required<unknown>();
  public readonly options = input.required<CrudItemOptions>();

  public readonly tooltipValue = computed(() => {
    return new CellTextContent({
      options: this.options(),
      cellValue: this.cellValue(),
    }).value;
  });
}
