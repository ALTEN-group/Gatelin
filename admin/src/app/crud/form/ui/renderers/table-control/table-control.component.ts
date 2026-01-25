import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemBase } from "@crud/core/models/crud-item-base.class";
import { TableCellComponent } from "@crud/core/ui/table-cell/table-cell.component";
import { TableFilterCellComponent } from "@crud/core/ui/table-filter-cell/table-filter-cell.component";
import { crudItemToColumn } from "@crud/core/utils/table/crud-item-to-column";
import { TableColumn } from "@crud/core/utils/table/table-column.model";
import { HasValidatorPipe } from "@crud/form/ui/renderers/table-control/has-validator.pipe";
import { isArray } from "@dwtechs/checkard";
import { FormFieldBaseComponent } from "@form/ui/renderers/form-field-base.component";
import { ButtonModule } from "primeng/button";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelect } from "primeng/multiselect";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "frm-table-control",
  templateUrl: "./table-control.component.html",
  styleUrls: ["./table-control.component.scss"],
  imports: [
    TableModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    ButtonModule,
    HasValidatorPipe,
    NgTemplateOutlet,
    TableFilterCellComponent,
    SelectModule,
    TableCellComponent,
    MultiSelect,
    TooltipModule,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.p-disabled]": "isDisabled()",
  },
})
export class TableControlComponent<
  T extends CrudItemBase,
> extends FormFieldBaseComponent {
  public readonly value = linkedSignal<T[]>(() => {
    const controlValue = this.control().value;
    if (!isArray<T>(controlValue)) {
      return [];
    }
    return controlValue.map((item) => ({
      ...item,
      internal_id: this.getUniqueRowKey(),
    }));
  });

  public readonly tableCtrlConfig = computed(() => {
    return this.options().tableCtrlConfig ?? {};
  });

  public readonly isHeaderHidden = computed(() => {
    return this.tableCtrlConfig().isHeaderHidden ?? false;
  });

  public readonly isSelectable = computed(() => {
    return (
      this.tableCtrlConfig().selectable ||
      this.tableCtrlConfig().isDeletionEnabled
    );
  });

  public readonly ControlType = CONTROL_TYPES;

  public readonly selectedRows = signal([]);

  public readonly columns = computed<TableColumn[]>(() => {
    const cols = this.options().tableCtrlColumns ?? [];
    const config = this.options().tableCtrlConfig ?? {};
    const sortedColKeys = config.sortedColumnKeys ?? [];
    const sortedColumns = sortedColKeys.length
      ? sortedColKeys
          .map((key) => cols.find((item) => item.key === key))
          .filter((item) => !!item)
      : cols;
    return sortedColumns
      .map((col) => crudItemToColumn(col))
      .filter((col) => col.isVisible);
  });

  public readonly editionMode = computed(() => {
    return this.options().tableCtrlConfig?.editionMode ?? "cell";
  });

  /** Saved original row in case of cancel (used in **row** edition mode) */
  private clonedRow: T | null = null;

  /** This property holds the index of the row with unsaved changes.
   * Used in **row** edition mode
   * Only for **multiselect** because we can go out of the cell without saving changes
   */
  public rowIndexWithUnsavedChanges = signal<number | null>(null);

  public onDeleteRows() {
    const selectedIndexes = this.selectedRows().map((row) =>
      this.value().indexOf(row),
    );
    const newRows = this.value().filter(
      (_, index) => !selectedIndexes.includes(index),
    );
    this.control().setValue(newRows);
    this.value.set(newRows);
    this.selectedRows.set([]);
  }

  public onAddNewRow() {
    const newRow = this.columns().reduce((acc, col) => {
      acc[col.key as keyof T] = null as T[keyof T];
      return acc;
    }, {} as T);
    const newRows = [
      ...this.value(),
      { ...newRow, internal_id: this.getUniqueRowKey() },
    ];
    this.control().setValue(newRows);
    this.value.set(newRows);
  }

  public onCellClicked(item: T, index: number) {
    if (this.isDisabled()) return;
    this.emitInteractionEvent("cellClicked", {
      row: item,
      index: index,
    });
  }

  public onMultiselectChange(rowIndex: number) {
    if (this.editionMode() === "row") {
      this.rowIndexWithUnsavedChanges.set(rowIndex);
    }
  }

  // Multiselect is kinda special because we can't use double data-binding
  // So we must update manually the value in row edition mode, but the value will be saved
  // only when user clicks on save button
  public saveMultiselectValue(
    newValue: unknown[],
    colKey: string,
    rowIndex: number,
  ) {
    if (this.editionMode() === "row") {
      this.rowIndexWithUnsavedChanges.set(null);
      this.value.update((rows) => {
        rows[rowIndex] = {
          ...rows[rowIndex],
          [colKey]: newValue,
        };
        return rows;
      });
    } else if (this.editionMode() === "cell") {
      this.saveCellValue(newValue, colKey, rowIndex);
    }
  }

  public saveCellValue(value: unknown, colKey: string, rowIndex: number) {
    if (this.editionMode() !== "cell") return;
    const newRows = this.value().map((r, index) => {
      if (index === rowIndex) {
        return {
          ...r,
          [colKey]: value,
        };
      }
      return r;
    });
    this.control().setValue(newRows);
    this.value.set(newRows);
    this.emitInteractionEvent("cellEditComplete", {
      rowIndex,
      colKey,
      value,
    });
  }

  public onRowEditCancel(rowIndex: number) {
    if (this.clonedRow) {
      const newRows = this.value().map((r, index) => {
        return index === rowIndex ? (this.clonedRow as T) : r;
      });
      this.control().setValue(newRows);
      this.value.set(newRows);
      this.clonedRow = null;
      this.emitInteractionEvent("rowEditCancel", {
        value: newRows,
        clonedRow: this.clonedRow,
      });
    }
  }

  public onRowEditSave() {
    this.clonedRow = null;
    this.control().setValue(this.value());
    this.emitInteractionEvent("rowEditComplete", {
      value: this.value(),
    });
  }

  public onRowEditInit(row: T) {
    this.clonedRow = { ...row };
    this.emitInteractionEvent("rowEditInit", {
      row,
    });
  }

  public onSelectionChanged() {
    this.emitInteractionEvent("rowsSelectionChange", {
      selectedRows: this.selectedRows(),
    });
  }

  private getUniqueRowKey() {
    return Date.now() + Math.random();
  }
}
