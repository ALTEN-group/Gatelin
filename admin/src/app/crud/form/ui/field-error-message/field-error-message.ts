import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { supplant } from "@crud/core/utils/supplant/supplant.utils";
import { BASE_FORM_ERROR_MESSAGES } from "@form/utils/form-error-messages";
import { APP_FORM_CONFIG } from "@form/utils/form.injection-token";

@Component({
  selector: "frm-error-message",
  template: `    
    @let message = errorMessage();
    <small class="control-error" [title]="message">
        {{ message }}
    </small>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorMessage {
  public readonly controlErrors = input.required<FormControl["errors"]>();

  private readonly customErrorMessages =
    inject(APP_FORM_CONFIG).customErrorMessages;

  public readonly errorMessage = computed(() => {
    const controlErrors = this.controlErrors() ?? {};
    const errorKeys = Object.keys(controlErrors);
    // No error keys: no errors to show
    if (!errorKeys.length) return "";
    // If control has errors, we show the first error
    const firstError = errorKeys[0];
    const errorContent = controlErrors[firstError];
    // errorContent is like: { requiredLength: 3, actualLength: 1 }
    if (errorContent) {
      const message = this.getMessage(firstError);
      // Enriches error message with error actual content
      return supplant(message, errorContent);
    }
    // Fallback to default message
    return this.getDefaultMessage();
  });

  // Merge base messages with custom messages
  private readonly messages = {
    ...BASE_FORM_ERROR_MESSAGES,
    ...this.customErrorMessages,
  };

  private getMessage(key: string): string {
    return (
      this.messages[key as keyof typeof BASE_FORM_ERROR_MESSAGES] ??
      this.getDefaultMessage()
    );
  }

  private getDefaultMessage(): string {
    return this.messages["*"];
  }
}
