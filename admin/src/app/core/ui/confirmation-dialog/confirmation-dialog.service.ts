import { DestroyRef, Injectable, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DialogService, DynamicDialogRef } from "@openng/optimus-ui/dynamicdialog";
import { Observable } from "rxjs";
import { ConfirmationDialogComponent } from "./confirmation-dialog.component";

const DEFAULT_MESSAGE = "Êtes-vous sûr de vouloir poursuivre ?";

@Injectable({
  providedIn: "root",
})
export class ConfirmationDialogService {
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);

  public confirm(message = DEFAULT_MESSAGE): Observable<boolean> {
    const ref = this.dialogService.open(ConfirmationDialogComponent, {
      header: "Confirmation",
      data: {
        message,
      },
    }) as DynamicDialogRef<ConfirmationDialogComponent>;
    return ref.onClose.pipe(takeUntilDestroyed(this.destroyRef));
  }
}
