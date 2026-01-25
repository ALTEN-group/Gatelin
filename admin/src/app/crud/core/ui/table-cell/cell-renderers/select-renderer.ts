import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { SelectItem } from "primeng/api";

@Component({
  selector: "tbl-select-cell-renderer",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let val = value();
    @if (val) {
        <span [class]="val.styleClass">
            {{val.label}}
        </span>
    }
  `,
})
export class SelectCellRendererComponent {
  public readonly cellValue = input.required<unknown>();
  public readonly options = input.required<CrudItemOptions>();

  private readonly isChip = computed(
    () => this.options().columnOptions?.valueAsChip ?? true,
  );

  public readonly value = computed<SelectItem | null>(() => {
    const cellValue = this.cellValue();
    const fullOption = this.options().options?.find(
      (opt) => opt.value === cellValue,
    );
    if (!fullOption) return null;
    return {
      ...fullOption,
      styleClass: `${fullOption.styleClass}${this.isChip() ? " p-chip" : ""}`,
    };
  });
}
