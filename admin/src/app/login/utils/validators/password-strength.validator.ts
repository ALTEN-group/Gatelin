import { AbstractControl, ValidationErrors } from "@angular/forms";
import {
  containsLowerCase,
  containsNumber,
  containsSpecialCharacter,
  containsUpperCase,
} from "@dwtechs/checkard";

export function PasswordStrengthValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value: string = control.value || "";

  if (!value) {
    return null;
  }

  //const upperCaseRegex = /[A-Z]+/;
  if (!containsUpperCase(value)) {
    return {
      passwordStrength: "Doit contenir au moins une majuscule",
    };
  }

  // const lowerCaseRegex = /[a-z]+/;
  if (!containsLowerCase(value)) {
    return {
      passwordStrength: "Doit contenir au moins une minuscule",
    };
  }

  // const numberRegex = /[0-9]+/g;
  if (!containsNumber(value)) {
    return { passwordStrength: "Doit contenir au moins un chiffre" };
  }

  // const specialRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?°`€£§]+/;
  if (!containsSpecialCharacter(value)) {
    return {
      passwordStrength: "Doit contenir au moins un caractère special",
    };
  }

  if (value.length < 8) {
    return { passwordStrength: "Doit contenir au moins 8 caractères" };
  }

  if (value.length > 20) {
    return { passwordStrength: "Doit contenir au maximum 20 caractères" };
  }

  return null;
}
