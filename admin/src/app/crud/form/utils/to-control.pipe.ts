import { Pipe, PipeTransform } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Pipe({
  name: "toControl",
  /**
   * Pipe that retrieves a specific `FormControl` from a given `FormGroup` by its key.
   *
   * @example
   * // In a template:
   * // <input [formControl]="form | toControl:'username'">
   *
   * @param form - The `FormGroup` instance containing the control.
   * @param key - The name of the control to retrieve from the form group.
   * @returns The `FormControl` associated with the specified key.
   */
})
export class ToControlPipe implements PipeTransform {
  transform(form: FormGroup, key: string): FormControl {
    return form.get(key) as FormControl;
  }
}
