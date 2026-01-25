import { Pipe } from "@angular/core";
import { ValidatorFn } from "@angular/forms";
import { required } from "@crud/form/utils/common.validators";

/**
 * Map of validator names to their corresponding ValidatorFn
 * Used to check for the presence of specific validators in a column's validator array
 * Currently supports 'required' validator
 */
const validatorMap: Record<string, ValidatorFn> = {
  required: required,
};

@Pipe({
  name: "hasValidator",
})
export class HasValidatorPipe {
  transform(
    colValidators: ValidatorFn[],
    validatorToCheck: "required" /**| "minLength" | "maxLength" | "min" | "max"*/,
  ): boolean {
    const validatorFn = validatorMap[validatorToCheck];
    return colValidators.includes(validatorFn);
  }
}
