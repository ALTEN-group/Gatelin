import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { isArray } from "@dwtechs/checkard";
import { SelectItem } from "primeng/api";

@Component({
  selector: "tbl-multiselect-cell-renderer",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (option of selectOptions(); track option) {
        <span [class]="option.styleClass">
            {{option.label}}
        </span>
    }
  `,
  host: {
    style: "display: flex; gap: 0.25rem;",
  },
})
export class MultiselectCellRendererComponent {
  public readonly cellValue = input.required<unknown>();
  public readonly options = input.required<CrudItemOptions>();

  private readonly isChip = computed(
    () => this.options().columnOptions?.valueAsChip ?? true,
  );

  public readonly selectOptions = computed<SelectItem[]>(() => {
    const cellValue = this.cellValue();
    if (isArray(cellValue)) {
      return cellValue
        .map((val) => this.options().options?.find((opt) => opt.value === val))
        .filter((val) => !!val)
        .map((val) => ({
          ...val,
          styleClass: `${val.styleClass}${this.isChip() ? " p-chip" : ""}`,
        }));
    }
    return [];
  });
}
