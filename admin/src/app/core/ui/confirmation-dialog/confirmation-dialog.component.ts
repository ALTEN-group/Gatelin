import { Component, inject } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: "shared-confirmation-dialog",
  templateUrl: "./confirmation-dialog.component.html",
  styleUrls: ["./confirmation-dialog.component.scss"],
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
