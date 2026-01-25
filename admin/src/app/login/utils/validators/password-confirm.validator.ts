import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const PasswordConfirmValidator: ValidatorFn = (
  // group: FormGroup
  group: AbstractControl,
): ValidationErrors | null => {
  const password1 = group.get("password");
  const password2 = group.get("passwordConfirm");

  return password1 && password2 && password1.value !== password2.value
    ? { notEqual: "Mots de passe différents" }
    : null;
};
