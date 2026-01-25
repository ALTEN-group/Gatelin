import { Component, inject } from "@angular/core";
import { ValidatorFn } from "@angular/forms";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { CrudButtonComponent } from "@crud/core/ui/crud-buttons/crud-buttons.component";
import { FormComponent } from "@crud/form/form/form.component";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

interface DialogData {
  config: CrudItemOptions[];
  model: Record<string, unknown>;
  groupValidator: ValidatorFn;
}

@Component({
  selector: "frm-table-form-wrapper",
  imports: [FormComponent, CrudButtonComponent],
  template: `
        <frm-form
            [config]="config"
            [model]="model"
            [groupValidator]="groupValidator"
            (modelChange)="onModelChange($event)"
        />
        <div class="p-dialog-footer">
            <crd-crud-button
                type="cancel"
                icon="pi pi-times"
                (click)="close()"
            />  
            <crd-crud-button
                type="validate"
                icon="pi pi-check"
                (click)="save()"
            />
        </div>
    `,
})
export class TableFormWrapperComponent {
  private readonly dialogConfig = inject(DynamicDialogConfig<DialogData>);
  private readonly dialogRef = inject(DynamicDialogRef);

  private readonly dialogData = this.dialogConfig.data;

  public readonly config: CrudItemOptions[] = this.dialogData.config;

  public readonly model: Record<string, unknown> = this.dialogData.model;

  public readonly groupValidator: ValidatorFn = this.dialogData.groupValidator;

  private updatedModel: Record<string, unknown> = { ...this.model };

  public onModelChange(updatedModel: Record<string, unknown>): void {
    this.updatedModel = updatedModel;
  }

  public save(): void {
    this.dialogRef.close(this.updatedModel);
  }

  public close(): void {
    this.dialogRef.close();
  }
}
