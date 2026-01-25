import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "@form/ui/renderers/form-field-base.component";
import { TextareaModule } from "primeng/textarea";

@Component({
  selector: "frm-textarea-control",
  templateUrl: "./textarea-control.component.html",
  imports: [TextareaModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaControlComponent extends FormFieldBaseComponent {}
