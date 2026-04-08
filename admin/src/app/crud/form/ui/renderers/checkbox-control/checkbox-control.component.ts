import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "@form/ui/renderers/form-field-base.component";
import { CheckboxModule } from "primeng/checkbox";

@Component({
  selector: "frm-checkbox-control",
  templateUrl: "./checkbox-control.component.html",
  styleUrls: ["./checkbox-control.component.scss"],
  imports: [ReactiveFormsModule, CheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxControlComponent extends FormFieldBaseComponent {}
