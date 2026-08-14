import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ButtonModule } from "@openng/optimus-ui/button";
import { DialogModule } from "@openng/optimus-ui/dialog";
import { DynamicDialogConfig, DynamicDialogRef } from "@openng/optimus-ui/dynamicdialog";

@Component({
  selector: "shared-confirmation-dialog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./confirmation-dialog.component.html",

  imports: [DialogModule, ButtonModule],
})
export class ConfirmationDialogComponent {
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  get message() {
    return this.config.data.message;
  }

  accept() {
    this.ref.close(true);
  }

  reject() {
    this.ref.close(false);
  }
}
