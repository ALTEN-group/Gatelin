import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";

export function patternValidator(config: {
  pattern: RegExp | string;
  message: string;
}): ValidatorFn {
  const patternValidator = Validators.pattern(config.pattern);

  return (control: AbstractControl): ValidationErrors | null => {
    const validationResult = patternValidator(control);

    if (validationResult) {
      return { pattern: { expected: config.message } };
    }
    return null;
  };
}
