import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
  viewChild,
} from "@angular/core";
import { isEqual } from "@crud/core/utils/arrays/is-equal.utils";
import { FormFieldBaseComponent } from "@form/ui/renderers/form-field-base.component";
import { SelectItem } from "primeng/api";
import { PickList, PickListModule } from "primeng/picklist";

@Component({
  selector: "frm-picklist-control",
  templateUrl: "./picklist-control.component.html",
  styleUrls: ["./picklist-control.component.scss"],
  imports: [PickListModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PicklistControlComponent extends FormFieldBaseComponent {
  public readonly picklist = viewChild<PickList>("picklist");

  public readonly allOptions = computed(() => this.config().options ?? []);

  //The sources and targets are used to populate the picklist
  public readonly sources = signal<SelectItem[]>([]);
  public readonly targets = signal<SelectItem[]>([]);

  //This effect is here to manage and update the values and the options when input data is edited
  readonly resetPicklistEffect = effect(() => {
    const allOptions = this.allOptions();
    const values = this.control()?.value ?? [];
    const picklist = this.picklist();

    const newSources = allOptions.filter((opt) => !values.includes(opt.value));
    const newTargets = allOptions.filter((opt) => values.includes(opt.value));
    //We prevent the ignals to be updated for no reason.
    //It mainly prevent the options to fast desapear and reapear when we edit the form

    if (!isEqual(newSources, this.sources())) {
      if (picklist) {
        picklist.resetFilter();
      }
      this.sources.set(newSources);
    }
    if (!isEqual(newTargets, this.targets())) {
      if (picklist) {
        picklist.resetFilter();
      }
      this.targets.set(newTargets);
    }
  });

  /**
   * Update the form control with current target values
   */
  public sync() {
    this.control().setValue(this.targets().map((opt) => opt.value));
  }
}
