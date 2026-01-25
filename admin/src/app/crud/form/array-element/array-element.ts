import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  inject,
  input,
  linkedSignal,
} from "@angular/core";
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { ControlOptions } from "@crud/core/models/control-options.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormBuilderService } from "@form/form-builder.service";
import { FormErrorMessage } from "@form/ui/field-error-message/field-error-message";
import { FormFieldRenderer } from "@form/ui/field-renderer/field-renderer";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "frm-array-element",
  templateUrl: "./array-element.html",
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    FormFieldRenderer,
    FormErrorMessage,
  ],
  styleUrls: ["./array-element.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormArrayElement {
  private readonly formService = inject(FormBuilderService);

  @HostBinding("class") get classes(): string {
    return this.parentControlOptions().hidden ? "display-none" : "";
  }
  @HostBinding("style") get style(): string {
    const { width, minWidth, maxWidth } = this.parentControlOptions();
    return `
      min-width: ${width ?? minWidth ?? this.defaultControlWidth()};
      max-width: ${width ?? maxWidth ?? this.defaultControlWidth()};
    `;
  }

  public readonly config = input.required<CrudItemOptions>();
  public readonly formGroup = input.required<FormGroup>();
  public readonly isFormReadonly = input.required<boolean | undefined>();
  public readonly defaultControlWidth = input.required<string>();
  public readonly syncValueInc = input.required<number>();

  private readonly formArray = computed<FormArray>(() => {
    return this.formGroup().get(this.config().key) as FormArray;
  });

  private readonly parentControlOptions = computed<ControlOptions>(() => {
    return this.config().controlOptions ?? {};
  });

  public readonly isDisabled = computed<boolean>(
    () =>
      this.isFormReadonly() || this.parentControlOptions().disabled === true,
  );

  public readonly controls = computed(
    () => this.formArray().controls as FormControl[],
  );

  public readonly arrayControlOptions = computed(
    () => this.parentControlOptions().controlArrayConfig ?? {},
  );

  /** Cannot delete and add are stored as writable signals because `controls()`
   * do not trigger computed()
   */
  public readonly cannotDelete = linkedSignal(() => {
    return this.isMinReached();
  });
  public readonly cannotAdd = linkedSignal(() => {
    return this.isMaxReached();
  });

  public addControl(): void {
    const control = this.formService.toFormControl(
      this.config(),
      "", // For now, we use an empty string as the initial value. But could (and should) do more.
      this.isFormReadonly() ?? false,
    );
    this.formArray().push(control);
    this.updateAddAndDeleteButtonState();
  }

  public removeControl(index: number): void {
    this.formArray().removeAt(index);
    this.updateAddAndDeleteButtonState();
  }

  private updateAddAndDeleteButtonState() {
    this.cannotAdd.set(this.isMaxReached());
    this.cannotDelete.set(this.isMinReached());
  }

  private isMaxReached(): boolean {
    return (
      this.controls().length >=
      (this.arrayControlOptions().maxItems ?? Number.POSITIVE_INFINITY)
    );
  }

  private isMinReached(): boolean {
    return this.controls().length <= (this.arrayControlOptions().minItems ?? 0);
  }
}
