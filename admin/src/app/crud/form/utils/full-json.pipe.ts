import { Pipe, PipeTransform } from "@angular/core";
import { ValidatorFn } from "@angular/forms";
import { isFunction } from "@dwtechs/checkard";

@Pipe({
  name: "fullJson",
})
export class FullJsonPipe implements PipeTransform {
  transform(value: any): string {
    return JSON.stringify(value, replacer, 2);
  }
}

function replacer(_key: string, value: unknown): unknown {
  if (isFunction(value)) {
    const knownValidator = isKnownValidator(value as ValidatorFn);
    return knownValidator ? knownValidator : "Function";
  }
  return value;
}

function isKnownValidator(value: Function): string | undefined {
  const knownValidators = [
    "required",
    "minlength",
    "maxlength",
    "min",
    "max",
    "email",
  ];
  const functionString = value.toString();
  return (
    functionString
      // split by whitespace and parenthesis and double quotes
      .split(/[\s()]+|"/)
      .find((part) => knownValidators.includes(part))
  );
}
