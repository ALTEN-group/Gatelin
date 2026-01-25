import { Injectable } from "@angular/core";
import {
  AsyncValidatorFn,
  FormArray,
  FormControl,
  UntypedFormGroup,
  ValidatorFn,
} from "@angular/forms";
import { ControlOptions } from "@crud/core/models/control-options.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { isArray, isNil } from "@dwtechs/checkard";
import { GroupValidatorFn } from "@form/utils/group-validator.model";

@Injectable({ providedIn: "root" })
export class FormBuilderService {
  public toFormGroup(
    items: CrudItemOptions[],
    values: { [key: string]: unknown },
    groupValidator: GroupValidatorFn | undefined,
    isReadonlyMode: boolean,
  ) {
    const group = new UntypedFormGroup({});
    for (const item of items) {
      const baseValue = values?.[item.key as keyof typeof values];
      // Form Group
      if (item.children?.length) {
        const formGroup = this.toFormGroup(
          item.children,
          baseValue as { [key: string]: unknown },
          undefined,
          isReadonlyMode,
        );
        group.addControl(item.key, formGroup);
        // Form Array
      } else if (item.controlOptions?.isFormArray) {
        const formArray = this.toFormArray(item, baseValue, isReadonlyMode);
        group.addControl(item.key, formArray);
        // Form Control
      } else {
        const value = this.getValue(item, baseValue);
        const formControl = this.toFormControl(item, value, isReadonlyMode);
        group.addControl(item.key, formControl);
      }
    }

    if (groupValidator) {
      group.setValidators(groupValidator);
    }

    return group;
  }

  private toFormArray(
    item: CrudItemOptions,
    values: unknown,
    isReadonlyMode: boolean,
  ): FormArray {
    // First we must validate that we are working on an array
    if (!isArray(values)) {
      throw Error(
        `Values provided for control ${item.key} are not a valid array: ${values}`,
      );
    }
    const controls = values.map((value) =>
      this.toFormControl(item, value, isReadonlyMode),
    );
    return new FormArray(controls);
  }

  public toFormControl(
    item: CrudItemOptions,
    value: unknown,
    isReadonlyMode: boolean,
  ): FormControl {
    const { validators, asyncValidators, disabled, nonNullable } =
      this.getFormControlOptions(item, isReadonlyMode);
    return new FormControl(
      { value, disabled },
      { validators, asyncValidators, nonNullable },
    );
  }

  private getValue(item: CrudItemOptions, baseValue: unknown): unknown | null {
    let value = baseValue;
    const { defaultValue } = item.controlOptions ?? {};
    if (isNil(value) || value === "") {
      value = defaultValue;
    }
    return value ?? null;
  }

  /**
   * Generates form control options including validators, async validators, disabled state, and non-nullability
   * based on the provided `CrudItemOptions` and the current readonly mode.
   *
   * @param item - The CRUD item options containing control configuration.
   * @param isReadonlyMode - Indicates if the form is in readonly mode.
   * @returns An object containing:
   *   - `validators`: An array of synchronous validator functions.
   *   - `asyncValidators`: An array of asynchronous validator functions.
   *   - `disabled`: Whether the control should be disabled.
   *   - `nonNullable`: Whether the control value should be non-nullable.
   */
  private getFormControlOptions(
    item: CrudItemOptions,
    isReadonlyMode: boolean,
  ): {
    validators: ValidatorFn[];
    asyncValidators: AsyncValidatorFn[];
    disabled: boolean;
    nonNullable: boolean;
  } {
    let validators: ValidatorFn[] = [];
    let asyncValidators: AsyncValidatorFn[] = [];
    const disabled = this.getDisableState(
      item.controlOptions ?? {},
      isReadonlyMode,
    );
    let nonNullable = false;
    const controlOptions = item.controlOptions;
    if (controlOptions) {
      validators = this.getValidators(controlOptions);
      asyncValidators = this.getAsyncValidators(controlOptions);
      nonNullable = controlOptions.nonNullable ?? false;
    }
    return { validators, asyncValidators, disabled, nonNullable };
  }

  private getDisableState(
    controlOptions: ControlOptions,
    isReadonlyMode: boolean,
  ): boolean {
    return controlOptions.disabled || isReadonlyMode;
  }

  private getValidators(controlOptions: ControlOptions): ValidatorFn[] {
    return controlOptions.validators?.length ? controlOptions.validators : [];
  }

  private getAsyncValidators(
    controlOptions: ControlOptions,
  ): AsyncValidatorFn[] {
    return controlOptions.asyncValidators?.length
      ? controlOptions.asyncValidators
      : [];
  }
}
