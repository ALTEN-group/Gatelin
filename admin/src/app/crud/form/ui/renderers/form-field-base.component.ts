import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  output,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { ControlOptions } from "@crud/core/models/control-options.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import {
  FormFieldInteraction,
  FormFieldInteractionEvent,
} from "@crud/core/models/form-field-interaction.event";
import { isArray } from "@dwtechs/checkard";
import { required, requiredTrue } from "@form/utils/common.validators";
import { SelectItem } from "primeng/api";

@Component({
  selector: "frm-field-base",
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldBaseComponent implements OnInit {
  public readonly config = input.required<CrudItemOptions>();
  public readonly control = input.required<FormControl>();
  public readonly isFormReadonly = input.required<boolean | undefined>();

  /**
   * Stores a incremental value to trigger change detection on the form field
   * Determines if the form field value should be synchronized with the model
   * Will be the default for every form control that use the reactive approach (e.g. [control])
   * But can be used for controls using template approach (e.g. [(ngModel)]), as Date and Radio controls.
   */
  public readonly syncValueInc = input<number>();

  public readonly fieldInteraction = output<FormFieldInteractionEvent>();

  public readonly isDisabled = computed(() => this.control().disabled);

  public readonly options = computed<Partial<ControlOptions>>(() => {
    return this.config().controlOptions ?? {};
  });

  public readonly placeholder = computed(() => {
    return this.options().placeholder ?? "";
  });

  public readonly isRequired = computed<boolean>(() => {
    return (
      !!this.config().key &&
      (this.control().hasValidator(required) ||
        this.control().hasValidator(requiredTrue))
    );
  });

  public readonly label = computed(() => {
    return this.options().label ?? this.config().label;
  });

  public readonly selectOptions = computed<SelectItem[]>(() => {
    return this.config().options ?? [];
  });

  public readonly showClear = computed<boolean>(() => {
    return this.options().isClearable ?? true;
  });

  ngOnInit(): void {
    // Display error in case of invalid form control
    const { value, valid } = this.control() || {};
    let hasValue = !!value;
    if (isArray(value)) {
      hasValue = value.length > 0;
    }
    if (hasValue && !valid) {
      this.control().markAsTouched();
    }
  }

  public emitInteractionEvent(
    interactionType: FormFieldInteraction,
    extraData?: any,
  ) {
    const event = this.buildInteractionEvent(interactionType, extraData);
    this.fieldInteraction.emit(event);
  }

  private buildInteractionEvent(
    interactionType: FormFieldInteraction,
    extraData?: any,
  ): FormFieldInteractionEvent {
    return {
      key: this.config().key,
      controlType: this.config().controlType,
      value: this.control().value,
      interactionType,
      timestamp: new Date(),
      extraData,
    };
  }
}
