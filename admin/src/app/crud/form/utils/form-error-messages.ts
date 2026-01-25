/**
 * Base error messages for form validation.
 * Can be extended or overridden by providing custom messages via FORM_CONFIG injection token.
 */
export const BASE_FORM_ERROR_MESSAGES = {
  "*": $localize`:@@Validators_Invalid:La valeur saisie est invalide`,
  required: $localize`:@@Validators_Required:Ce champ est obligatoire`,
  unknownValue: $localize`:@@Validators_Unknown:Merci de sélectionner une des valeurs suggérées`,
  emailInvalid: $localize`:@@Validators_EmailInvalid:L'email est invalide`,
  minlength: $localize`:@@Validators_MinLength:La valeur saisie est trop courte ({requiredLength} caractères minimum)`,
  maxlength: $localize`:@@Validators_MaxLength:La valeur saisie est trop longue ({requiredLength} caractères maximum)`,
  max: $localize`:@@Validators_Max:La valeur doit étre inférieure ou égale à {max}`,
  min: $localize`:@@Validators_Min:La valeur doit étre supérieure ou égale à {min}`,
  pattern: "{expected}",
  maxFileSize: $localize`:@@Validators_MaxFileSize:La taille du fichier dépasse la taille maximale autorisée`,
};
