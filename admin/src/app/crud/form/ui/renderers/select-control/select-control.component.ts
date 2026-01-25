import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "@form/ui/renderers/form-field-base.component";
import { SelectModule } from "primeng/select";

@Component({
  selector: "frm-select-control",
  templateUrl: "./select-control.component.html",
  styleUrls: ["./select-control.component.scss"],
  imports: [SelectModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectControlComponent extends FormFieldBaseComponent {}
