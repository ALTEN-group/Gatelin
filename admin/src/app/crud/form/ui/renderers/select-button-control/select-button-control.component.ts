import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { isNil } from "@dwtechs/checkard";
import { FormFieldBaseComponent } from "@form/ui/renderers/form-field-base.component";
import { SelectButtonModule } from "primeng/selectbutton";

@Component({
  selector: "frm-select-button-control",
  templateUrl: "./select-button-control.component.html",
  imports: [SelectButtonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectButtonControlComponent extends FormFieldBaseComponent {
  public readonly unselectable = computed(() => {
    const toggleable = this.options().isSelectButtonOptionToggleable;
    return !isNil(toggleable) ? !toggleable : true;
  });
}
