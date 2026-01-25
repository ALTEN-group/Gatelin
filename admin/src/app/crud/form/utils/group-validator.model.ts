import { AbstractControl } from "@angular/forms";

/**
 * Extended validation errors interface that enforces a structure with a required message
 * and allows additional properties of unknown type
 */
export interface TypedValidationErrors {
  [key: string]: {
    message: string; // Message to interpolate if needed
    [key: string]: unknown; // Extra data for interpolation
  };
}

/**
 * Extended validator function type that returns strongly-typed validation errors
 */
export type GroupValidatorFn = (
  control: AbstractControl,
) => TypedValidationErrors | null;
