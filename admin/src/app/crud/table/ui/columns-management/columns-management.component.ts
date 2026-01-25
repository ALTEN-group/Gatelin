import { CdkDragDrop, DragDropModule } from "@angular/cdk/drag-drop";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TableColumn } from "@crud/core/utils/table/table-column.model";
import { ExtendedTableConfig } from "@table/data-access/table-config.model";
import { ListboxModule } from "primeng/listbox";

@Component({
  selector: "tbl-columns-management",
  templateUrl: "./columns-management.component.html",
  styleUrls: ["./columns-management.component.scss"],
  imports: [ListboxModule, DragDropModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ColumnsManagementComponent {
  public readonly activeView = input.required<ExtendedTableConfig>();
  public readonly isViewCreation = input.required<boolean>();
  public readonly isPreferencesModeEnabled = input.required<boolean>();

  public readonly columnsReordered = output<CdkDragDrop<string[]>>();
  public readonly selectedColumnsKeysChange = output<string[]>();

  public readonly selectedColumnsKeys = linkedSignal(() =>
    this.activeView()
      .columns.filter((col) => col.isVisible)
      .map((col) => col.key),
  );

  public readonly isColumnsEditionDisabled = computed(() => {
    // If preferences mode is not enabled, we can edit the default view
    if (!this.isPreferencesModeEnabled()) {
      return false;
    }
    // If we are creating a new view, we cannot edit columns
    if (this.isViewCreation()) {
      return false;
    }
    // Otherwise, we can edit columns only if the active view is not default
    return this.activeView().isDefault;
  });

  public isOptionDisabled(col: string) {
    return (col as unknown as TableColumn).isHardHidden === true;
  }

  public onChange(): void {
    this.selectedColumnsKeysChange.emit(this.selectedColumnsKeys());
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    this.columnsReordered.emit(event);
  }
}
