import { Pipe, PipeTransform } from "@angular/core";
import { FormGroup } from "@angular/forms";

/**
 * Angular pipe to extract a FormGroup from a parent FormGroup using a key.
 *
 * @param parentForm The parent FormGroup.
 * @param key The key of the child FormGroup to retrieve.
 * @returns The child FormGroup if found, otherwise null.
 * @throws If the control at the given key is not a FormGroup.
 * @example
 *   <form [formGroup]="parentForm">
 *     <div *ngIf="parentForm | formGroupByKey:'address' as addressGroup">
 *       <!-- Use addressGroup here -->
 *     </div>
 *   </form>
 */
@Pipe({
  name: "formGroupByKey",
  pure: true,
})
export class FormGroupByKeyPipe implements PipeTransform {
  transform(parentForm: FormGroup, key: string): FormGroup | null {
    if (!parentForm || !key) {
      return null;
    }
    const control = parentForm.get(key);
    if (control instanceof FormGroup) {
      return control;
    }
    return null;
  }
}
