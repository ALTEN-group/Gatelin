import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  model,
  output,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { TableColumn } from "@crud/core/utils/table/table-column.model";
import { ExtendedTableConfig } from "@table/data-access/table-config.model";
import { ColumnsManagementComponent } from "@table/ui/columns-management/columns-management.component";
import { ColumnsViewsComponent } from "@table/ui/columns-views/columns-views.component";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";

@Component({
  selector: "tbl-columns-management-dialog",
  templateUrl: "./columns-management-dialog.component.html",
  styleUrls: ["./columns-management-dialog.component.scss"],
  imports: [
    DialogModule,
    ButtonModule,
    ColumnsManagementComponent,
    ColumnsViewsComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnsManagementDialogComponent {
  public readonly views = input.required<ExtendedTableConfig[]>();
  public readonly isPreferencesModeEnabled = input.required<boolean>();
  public readonly visible = model(false);

  public readonly closed = output();
  public readonly saved = output<ExtendedTableConfig[]>();

  public readonly editedViews = linkedSignal(() => this.views());
  public readonly activeView = computed(
    () => this.editedViews().find((view) => view.isActive) ?? this.views()[0],
  );
  private readonly localColumns = linkedSignal<TableColumn[]>(
    () => this.activeView().columns,
  );

  public readonly isDefaultViewActive = computed(
    () => this.activeView().isDefault,
  );
  public readonly isViewCreation = signal(false);

  public onSelectView(viewId: number): void {
    const view = this.editedViews().find((v) => v.id === viewId);
    if (!view) return;
    // Find old active view and update its columns before changing active view
    const oldActiveView = this.activeView();
    this.setColumnsInView(oldActiveView.id as number, this.localColumns());
    // Set new active view
    this.editedViews.update((views) =>
      views.map((v) => ({ ...v, isActive: v.id === viewId })),
    );
  }

  public onSelectedColumnsKeysChange(selectedColumnsKeys: string[]): void {
    const columns = this.localColumns().map((col) => {
      return { ...col, isVisible: selectedColumnsKeys.includes(col.key) };
    });
    this.localColumns.set(columns);
  }

  public onColumnsReordered(event: CdkDragDrop<string[]>): void {
    const columns = [...this.localColumns()];
    moveItemInArray(columns, event.previousIndex, event.currentIndex);
    this.localColumns.set(columns);
  }

  public onCreateView(name: string): void {
    const newView: ExtendedTableConfig = {
      id: Date.now(),
      name,
      isActive: true,
      isDefault: false,
      columns: this.activeView().columns,
      conf: this.activeView().conf,
      component: this.activeView().component,
    };
    const currentViews = this.editedViews().map((v) => ({
      ...v,
      isActive: false,
    }));
    this.editedViews.update(() => [...currentViews, newView]);
    this.isViewCreation.set(false);
  }

  public onDeleteView(viewId: number): void {
    const views = this.editedViews().filter((v) => v.id !== viewId);
    if (!views.some((v) => v.isActive) && views.length > 0) {
      views[0].isActive = true;
    }
    this.editedViews.set(views);
  }

  public onSaved(): void {
    this.setColumnsInView(this.activeView().id as number, this.localColumns());
    this.saved.emit(this.editedViews());
  }

  public onCancel(): void {
    this.closed.emit();
  }

  private setColumnsInView(viewId: number, columns: TableColumn[]): void {
    const conf = columns.map((col) => ({
      key: col.key,
      isVisible: col.isVisible,
    }));
    this.editedViews.update((views) => {
      return views.map((v) => {
        if (v.id === viewId) {
          return {
            ...v,
            columns,
            conf,
          };
        }
        return v;
      });
    });
  }
}
