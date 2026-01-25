import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "@form/ui/renderers/form-field-base.component";
import { InputTextModule } from "primeng/inputtext";

@Component({
  selector: "frm-inputtext-control",
  templateUrl: "./inputtext-control.component.html",
  imports: [InputTextModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextControlComponent extends FormFieldBaseComponent {
  public readonly maxLength = computed<number | null>(() => {
    return this.options().maxLength || null;
  });

  public readonly minLength = computed<number | null>(() => {
    return this.options().minLength || null;
  });
}
