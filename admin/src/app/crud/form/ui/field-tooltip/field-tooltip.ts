import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "frm-field-tooltip",
  templateUrl: "./field-tooltip.html",
  imports: [TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldTooltip {
  public readonly value = input.required<string | undefined>();
}
