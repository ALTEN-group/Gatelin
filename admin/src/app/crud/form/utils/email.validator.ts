import { AbstractControl, ValidationErrors } from "@angular/forms";
import { isEmail } from "@dwtechs/checkard";

export function EmailValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const email: string = control.value || "";
  if (!email) {
    return null;
  }

  return isEmail(email) ? null : { emailInvalid: "Email invalide" };
}
