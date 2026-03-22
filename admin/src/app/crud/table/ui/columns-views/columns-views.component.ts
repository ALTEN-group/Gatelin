import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ConfirmationDialogService } from "@core/ui/confirmation-dialog/confirmation-dialog.service";
import { TableConfig } from "@table/data-access/table-config.model";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ListboxModule } from "primeng/listbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { filter } from "rxjs";

const deleteConfirmationMessage = $localize`:@@Table_ColumnsViews_DeleteConfirmationMessage:Êtes-vous sûr de vouloir supprimer cette vue ?`;

@Component({
  selector: "tbl-columns-views",
  templateUrl: "./columns-views.component.html",
  styleUrls: ["./columns-views.component.scss"],
  imports: [
    RadioButtonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ListboxModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnsViewsComponent {
  private readonly confirmationDialogService = inject(
    ConfirmationDialogService,
  );
  private readonly destroyRef = inject(DestroyRef);

  public readonly views = input.required<TableConfig[]>();

  public readonly deleteView = output<number>();
  public readonly viewSelected = output<number>();
  public readonly viewCreationClicked = output<void>();
  public readonly viewCreationDone = output<string>();

  public readonly activeViewId = computed(() => {
    return this.views().find((view) => view.isActive)?.id ?? null;
  });

  public isNewFieldDisplayed = false;

  public onSelectView(viewId: number): void {
    this.viewSelected.emit(viewId);
  }

  public onDeleteView(event: Event, viewId: number | null): void {
    event.stopPropagation();
    if (!viewId) {
      return;
    }
    this.confirmationDialogService
      .confirm(deleteConfirmationMessage)
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.deleteView.emit(viewId);
      });
  }

  public showNewViewField(): void {
    this.isNewFieldDisplayed = true;
    this.viewCreationClicked.emit();
  }

  public hideNewViewField(name?: string): void {
    this.isNewFieldDisplayed = false;
    this.viewCreationDone.emit(name ?? "");
  }
}
