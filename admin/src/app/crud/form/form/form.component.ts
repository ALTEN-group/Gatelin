import { JsonPipe, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
} from "@angular/forms";
import {
  ControlActionResult,
  ControlOptions,
} from "@crud/core/models/control-options.model";
import {
  ConditionFn,
  ControlOptionsCondition,
  CrudItemOptions,
} from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { CrudButtonComponent } from "@crud/core/ui/crud-buttons/crud-buttons.component";
import { isEqual } from "@crud/core/utils/arrays/is-equal.utils";
import { supplant } from "@crud/core/utils/supplant/supplant.utils";
import { isArray, isFunction, isNil } from "@dwtechs/checkard";
import { FormArrayElement } from "@form/array-element/array-element";
import { FormSimpleElement } from "@form/simple-element/simple-element";
import { FormGroupByKeyPipe } from "@form/utils/form-group.pipe";
import { FullJsonPipe } from "@form/utils/full-json.pipe";
import {
  GroupValidatorFn,
  TypedValidationErrors,
} from "@form/utils/group-validator.model";
import { LabelStrategy } from "@form/utils/label-strategy.model";
import { ToControlPipe } from "@form/utils/to-control.pipe";
import { PanelModule } from "primeng/panel";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { debounceTime, distinctUntilChanged, Subscription } from "rxjs";
import { FormBuilderService } from "../form-builder.service";

export const FOUR_COLUMN_WIDTH = "25%";
export const THREE_COLUMN_WIDTH = "33.333%";
export const TWO_COLUMN_WIDTH = "50%";
export const ONE_COLUMN_WIDTH = "100%";

@Component({
  selector: "frm-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormSimpleElement,
    JsonPipe,
    FullJsonPipe,
    ProgressSpinnerModule,
    FormGroupByKeyPipe,
    NgTemplateOutlet,
    FormArrayElement,
    ToControlPipe,
    CrudButtonComponent,
    PanelModule,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent<
  T extends { [key: string]: unknown } = { [key: string]: unknown },
> implements OnInit
{
  // Injected services
  private readonly dynamicFormService = inject(FormBuilderService);
  private readonly destroyRef = inject(DestroyRef);

  // Inputs
  /** Defines the number of columns for form layout */
  public readonly columnsCount = input<1 | 2 | 3 | 4>(1);

  /** Configuration array that defines the structure and behavior of form fields */
  public readonly config = model.required<CrudItemOptions[]>();

  /** Trigger to force form recreation */
  public readonly forceReload = input(0);

  /** Trigger to force form values reload without recreating the form */
  public readonly forceReloadValues = input(0);

  /** Custom validator applied to the entire form group */
  public readonly groupValidator = input<GroupValidatorFn | undefined>();

  /** Makes the entire form read-only */
  public readonly isReadonly = input<boolean | undefined>(false);

  /** Strategy for generating labels for form controls */
  public readonly labelStrategy = input<LabelStrategy>("ifta");

  /** Variant for the label strategy. Will be applied for float labels */
  public readonly labelStrategyVariant = input<
    "on" | "in" | "over" | undefined
  >("on");

  /** Two-way binding for form values */
  public readonly model = model.required<any>();

  /** Custom label for the reset button */
  public readonly resetButtonLabel = input<string | undefined>(
    $localize`:@@form.reset:Réinitialiser`,
  );

  /** Shows debug information including form values and validation state */
  public readonly showDebug = input<boolean | undefined>(false);

  /** Shows/hides the reset button */
  public readonly showReset = input<boolean | undefined>(false);

  /** Shows/hides the submit button */
  public readonly showSubmit = input<boolean | undefined>(false);

  /** Custom label for the submit button */
  public readonly submitButtonLabel = input<string | undefined>(
    $localize`:@@form.submit:Valider`,
  );

  // Outputs
  /** Emitted when user interacts with form fields */
  public readonly fieldInteraction = output<FormFieldInteractionEvent>();

  /** Emitted when form values change (two-way binding) */
  public readonly modelChange = output<any>();

  /** Emitted when form is reset (if showReset is true) */
  public readonly reset = output<void>();

  /** Emitted when form is submitted (if showSubmit is true) */
  public readonly submitted = output<any>();

  /** Emitted when form validation state changes */
  public readonly validityChange = output<boolean>();

  // ViewChild
  /** Angular FormGroupDirective reference */
  public readonly formDir = viewChild("formGroup", {
    read: FormGroupDirective,
  });

  // Computed
  /** Default width for form controls based on column count */
  public readonly defaultControlWidth = computed(() => {
    const size = this.columnsCount();
    switch (size) {
      case 4:
        return FOUR_COLUMN_WIDTH;
      case 3:
        return THREE_COLUMN_WIDTH;
      case 2:
        return TWO_COLUMN_WIDTH;
      default:
        return ONE_COLUMN_WIDTH;
    }
  });

  public readonly syncValueInc = signal(0);

  /** Angular FormGroup instance */
  public readonly form = signal<FormGroup | null>(null);

  /** Formatted error messages from form validation */
  public get formErrors() {
    const errors: TypedValidationErrors = this.form()?.errors ?? {};
    return Object.values(errors)
      .map((error) =>
        supplant(error.message, error as Record<string, string | number>),
      )
      .join(", ");
  }

  // Effects
  /** Effect to handle form reload when forceReload input changes */
  readonly forceReloadFormEffect = effect(() => {
    if (this.forceReload() !== this.prevReloadForm) {
      this.prevReloadForm = this.forceReload();
      this.destroyForm();
      this.createAndWatchForm();
    }
  });

  // Private properties
  private initialValues: { [key: string]: unknown } = {};
  private prevReloadForm = 0;
  private sub: Subscription | null = null;

  private readonly pendingActions = signal<ControlActionResult[]>([]);

  // Lifecycle methods
  /**
   * Angular OnInit lifecycle hook
   * Initializes form creation and change watching
   */
  ngOnInit(): void {
    this.createAndWatchForm();
  }

  // Public methods
  /**
   * Resets form to initial values and emits reset event
   * resetForm() => clean values, validators, touched/dirty statuses...
   * resetForm(value) => set specific values but clean the rest
   */
  public onReset() {
    this.formDir()?.resetForm(this.initialValues);
    this.syncValueInc.update((n) => n + 1);
    this.reset.emit();
  }

  /**
   * Handles form submission if valid
   */
  public onSubmit() {
    if (!this.form()?.valid) {
      console.warn("Form is invalid, cannot submit.");
      // TODO: check show errors
      return;
    }
    // Reset the form to the saved values
    const newInitialValues = this.model();
    this.formDir()?.resetForm(newInitialValues);
    this.initialValues = newInitialValues;
    // Emit event for optional parent use
    this.submitted.emit(this.model());
  }

  /**
   * Track function for ngFor to optimize rendering
   */
  public trackControl(index: number, item: CrudItemOptions): string {
    return `${index}-${item.key}-${JSON.stringify(item.controlOptions)}`;
  }

  public emitInteraction(event: FormFieldInteractionEvent) {
    this.fieldInteraction.emit(event);
    // Add to pending action if one is found for this control
    const action = this.config().find((item) => item.key === event.key)
      ?.controlOptions?.action;
    const pendingAction = action?.(event);
    if (pendingAction) {
      this.pendingActions.update((actions) => [...actions, ...pendingAction]);
    }
  }

  // Private methods
  /**
   * Applies condition result to the actual form control
   */
  private applyCondition(
    controlKey: string | number,
    propertyName: string,
    value: unknown,
    parentForm: FormGroup | null,
  ): void {
    const control = this.getControl(controlKey, parentForm);
    if (!control) return;
    switch (propertyName) {
      case "validators": {
        this.setValidators(control, value as ValidatorFn[]);
        break;
      }
      case "asyncValidators": {
        this.setAsyncValidators(control, value as AsyncValidatorFn[]);
        break;
      }
      case "disabled": {
        this.setDisabled(control, value as boolean);
        break;
      }
      case "hidden": {
        this.setHidden(control, value as boolean);
        break;
      }
      case "defaultValue": {
        control.setValue(value);
        break;
      }
    }
  }

  /**
   * Creates form group and sets up value change watching
   */
  private createAndWatchForm(): void {
    // Evaluate expressions before creating the form
    this.updateControlsWithConditions();
    // Create the form group
    const form = this.dynamicFormService.toFormGroup(
      this.config(),
      this.model(),
      this.groupValidator(),
      this.isReadonly() ?? false,
    );
    // Set the initial values according to what has been set in the form
    const initialValues = form.getRawValue();
    this.model.set(initialValues);
    this.initialValues = initialValues;
    // Set the form group in the signal
    this.form.set(form);
    // Listen to changes in the form values
    this.sub = form.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => isEqual(a, b)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        // Get raw values to avoid issues with disabled controls
        const values = this.form()?.getRawValue();
        this.log();
        const evaluatedValues = this.evaluatePendingActions(values);
        this.pendingActions.set([]);
        this.model.set(evaluatedValues);
        this.modelChange.emit(evaluatedValues);
        this.updateControlsWithConditions();
        this.validityChange.emit(this.form()?.valid ?? false);
      });
  }

  private evaluatePendingActions(currentValue: T): T {
    let evaluatedValue = { ...currentValue };
    const actions = this.pendingActions();
    for (const action of actions) {
      // Do nothing if soft action and value is already set
      if (!isNil(evaluatedValue[action.key]) && action.soft) continue;
      // Otherwise, evaluate the action mode: push, remove, set (default)
      let valueToSet = action.value;
      switch (action.mode) {
        case "push": {
          const current = evaluatedValue[action.key];
          if (isNil(current)) {
            valueToSet = [action.value];
          } else if (isArray(current)) {
            valueToSet = [...current, action.value];
          }
          break;
        }
        case "remove": {
          const current = evaluatedValue[action.key];
          if (isArray(current)) {
            valueToSet = current.filter(
              (item: unknown) => item !== action.value,
            );
          }
          break;
        }
        default: {
          break;
        }
      }
      this.form()?.get(action.key)?.setValue(valueToSet, { emitEvent: false });
      evaluatedValue = { ...evaluatedValue, [action.key]: valueToSet };
    }
    return evaluatedValue;
  }

  private log() {
    const formDir = this.formDir();
    if (formDir) {
      console.log({ value: formDir.value, valid: formDir.valid });
    }
  }

  /**
   * Destroys current form and cleans up subscriptions
   */
  private destroyForm(): void {
    this.form.set(null);
    this.sub?.unsubscribe();
    this.sub = null;
  }

  /**
   * Gets a form control by key from parent form
   */
  private getControl(
    itemKey: string | number,
    parentForm: FormGroup | null,
  ): AbstractControl | null {
    return parentForm?.get(itemKey.toString()) ?? null;
  }

  /**
   * Recursively evaluates and applies conditions to a control
   */
  private getUpdatedControl(
    control: CrudItemOptions,
    parentForm: FormGroup | null,
    model: T,
  ): CrudItemOptions {
    // recursively evaluate conditions
    // the value can either be a function or a nested property
    for (const key in control.conditions) {
      const prop = key as keyof CrudItemOptions;
      const value = control.conditions[prop];
      if (isFunction(value)) {
        const result = (value as ConditionFn)({ control, model });
        (control[prop] as any) = result;
      } else {
        if (!control.controlOptions) control.controlOptions = {};
        for (const subKey in value) {
          const subProp = subKey as keyof ControlOptions;
          const subValue = (value as ControlOptionsCondition)[subProp];
          if (isFunction(subValue)) {
            const result = (subValue as ConditionFn)({ control, model });
            (control.controlOptions[subProp] as any) = result;
            this.applyCondition(control.key, subProp, result, parentForm);
          }
        }
      }
    }
    return {
      ...control,
      controlOptions: control.controlOptions
        ? { ...control.controlOptions }
        : undefined,
    }; // create a new object to trigger change detection
  }

  /**
   * Sets async validators on a form control
   */
  private setAsyncValidators(
    control: AbstractControl,
    asyncValidators: AsyncValidatorFn[],
  ) {
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();
  }

  /**
   * Enables or disables a form control
   */
  private setDisabled(control: AbstractControl, disabled: boolean) {
    if (disabled) {
      control.disable();
    } else {
      control.enable();
    }
  }

  /**
   * Shows or hides a form control and resets its value if hidden
   */
  private setHidden(control: AbstractControl, hidden: boolean) {
    if (hidden) {
      const isFormArray = control instanceof FormArray;
      if (isFormArray) {
        control.clear();
      } else {
        // Simple FormControl
        control.reset();
      }
    }
  }

  /**
   * Sets validators on a form control
   */
  private setValidators(control: AbstractControl, validators: ValidatorFn[]) {
    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  /**
   * Updates control configurations based on conditional logic
   */
  private updateControlsWithConditions(): void {
    const model = this.model();
    this.config.update((controls) => {
      return controls.map((control) => {
        if (control.conditions) {
          return this.getUpdatedControl(control, this.form(), model);
        }
        if (control.children) {
          const form = this.form()?.get(control.key) as FormGroup;
          const values = (model[control.key] ?? {}) as T;
          const updatedChildren = [];
          for (const child of control.children) {
            updatedChildren.push(this.getUpdatedControl(child, form, values));
          }
          return { ...control, children: updatedChildren };
        }
        return control;
      });
    });
  }
}
