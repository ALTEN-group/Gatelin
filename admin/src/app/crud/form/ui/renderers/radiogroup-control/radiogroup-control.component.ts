import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "@form/ui/renderers/form-field-base.component";
import { SharedModule } from "primeng/api";
import { RadioButtonClickEvent, RadioButtonModule } from "primeng/radiobutton";

@Component({
  selector: "frm-radiogroup-control",
  templateUrl: "./radiogroup-control.component.html",
  styleUrls: ["./radiogroup-control.component.scss"],
  imports: [RadioButtonModule, FormsModule, SharedModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupComponent extends FormFieldBaseComponent {
  public value: string | number | null = null;

  public onClick(event: RadioButtonClickEvent) {
    this.emitInteractionEvent("click");
    const haveValueChanged = event.value !== this.control().value;
    //We dont want to proced to change notification if we click multiple time at same button
    if (!haveValueChanged) return;
    this.touch(event.value);
  }

  public unselect(event: MouseEvent) {
    event.preventDefault();
    this.value = null;
    this.touch(null);
  }

  private touch(value: string | number | null) {
    this.control().setValue(value);
    this.control().markAllAsDirty();
    this.emitInteractionEvent("valueChange");
  }
}
