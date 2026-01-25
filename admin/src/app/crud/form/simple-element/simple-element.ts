import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  output,
  ViewEncapsulation,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ControlOptions } from "@crud/core/models/control-options.model";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { required } from "@crud/form/utils/common.validators";
import { isNil } from "@dwtechs/checkard";
import { FormErrorMessage } from "@form/ui/field-error-message/field-error-message";
import { FormFieldRenderer } from "@form/ui/field-renderer/field-renderer";
import { LabelWrapperComponent } from "@form/ui/label-wrapper/label-wrapper";
import { LabelStrategy } from "@form/utils/label-strategy.model";
import { SharedModule } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { IftaLabelModule } from "primeng/iftalabel";
import { MultiSelectModule } from "primeng/multiselect";

@Component({
  selector: "frm-simple-element",
  templateUrl: "./simple-element.html",
  styleUrls: ["./simple-element.scss"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    SharedModule,
    CheckboxModule,
    ButtonModule,
    IftaLabelModule,
    FormErrorMessage,
    FormFieldRenderer,
    LabelWrapperComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.display-none]": "!isVisible()",
    "[style.minWidth]": "width() ?? minWidth() ?? defaultControlWidth()",
    "[style.maxWidth]": "width() ?? maxWidth() ?? defaultControlWidth()",
    "[class]": "controlOptions().styleClass",
  },
})
export class FormSimpleElement implements OnInit {
  public readonly config = input.required<CrudItemOptions>();
  public readonly control = input.required<FormControl>();
  public readonly isFormReadonly = input.required<boolean | undefined>();
  public readonly defaultControlWidth = input.required<string>();
  public readonly labelStrategy = input.required<LabelStrategy>();
  public readonly labelStrategyVariant = input.required<
    "on" | "in" | "over" | undefined
  >();
  public readonly syncValueInc = input.required<number>();

  public readonly fieldInteraction = output<FormFieldInteractionEvent>();

  public readonly ControlType = CONTROL_TYPES;

  protected readonly controlOptions = computed<Partial<ControlOptions>>(() => {
    return this.config()?.controlOptions ?? {};
  });

  protected readonly width = computed(() => this.controlOptions().width);
  protected readonly minWidth = computed(() => this.controlOptions().minWidth);
  protected readonly maxWidth = computed(() => this.controlOptions().maxWidth);

  protected readonly isVisible = computed<boolean>(() => {
    return !this.controlOptions().hidden;
  });

  ngOnInit(): void {
    if (
      !isNil(this.control().value) &&
      !this.control().hasValidator(required)
    ) {
      this.control().markAsTouched();
    }
  }
}
