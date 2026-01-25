import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "@form/ui/renderers/form-field-base.component";
import { IftaLabelModule } from "primeng/iftalabel";
import { MultiSelectModule } from "primeng/multiselect";

@Component({
  standalone: true,
  imports: [MultiSelectModule, ReactiveFormsModule, IftaLabelModule],
  selector: "frm-multi-select-control",
  templateUrl: "./multi-select-control.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectControlComponent extends FormFieldBaseComponent {}
