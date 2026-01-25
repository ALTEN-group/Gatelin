import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl } from "@angular/forms";
import { BASE_FORM_ERROR_MESSAGES } from "@form/utils/form-error-messages";
import { APP_FORM_CONFIG } from "@form/utils/form.injection-token";
import { FormErrorMessage } from "./field-error-message";

describe("FormErrorMessage", () => {
  let fixture: ComponentFixture<FormErrorMessage>;
  let component: FormErrorMessage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormErrorMessage],
    });
    fixture = TestBed.createComponent(FormErrorMessage);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  describe("Error Message Display", () => {
    it("should return empty string when no errors are present", () => {
      fixture.componentRef.setInput("controlErrors", null);
      fixture.detectChanges();

      expect(component.errorMessage()).toBe("");
    });

    it("should return empty string when errors object is empty", () => {
      fixture.componentRef.setInput("controlErrors", {});
      fixture.detectChanges();

      expect(component.errorMessage()).toBe("");
    });

    it("should display required error message", () => {
      const errors = { required: true };
      fixture.componentRef.setInput("controlErrors", errors);
      fixture.detectChanges();

      expect(component.errorMessage()).toBe(BASE_FORM_ERROR_MESSAGES.required);
    });

    it("should display email invalid error message", () => {
      const errors = { emailInvalid: true };
      fixture.componentRef.setInput("controlErrors", errors);
      fixture.detectChanges();

      expect(component.errorMessage()).toBe(
        BASE_FORM_ERROR_MESSAGES.emailInvalid,
      );
    });

    it("should display minlength error message with interpolated values", () => {
      const errors = { minlength: { requiredLength: 5, actualLength: 2 } };
      fixture.componentRef.setInput("controlErrors", errors);
      fixture.detectChanges();

      expect(component.errorMessage()).toContain("5");
    });

    it("should display maxlength error message with interpolated values", () => {
      const errors = { maxlength: { requiredLength: 10, actualLength: 15 } };
      fixture.componentRef.setInput("controlErrors", errors);
      fixture.detectChanges();

      expect(component.errorMessage()).toContain("10");
    });

    it("should display min error message with interpolated value", () => {
      const errors = { min: { min: 10, actual: 5 } };
      fixture.componentRef.setInput("controlErrors", errors);
      fixture.detectChanges();

      expect(component.errorMessage()).toContain("10");
    });

    it("should display max error message with interpolated value", () => {
      const errors = { max: { max: 100, actual: 150 } };
      fixture.componentRef.setInput("controlErrors", errors);
      fixture.detectChanges();

      expect(component.errorMessage()).toContain("100");
    });

    it("should display the first error when multiple errors are present", () => {
      const errors = {
        required: true,
        minlength: { requiredLength: 5, actualLength: 2 },
        emailInvalid: true,
      };
      fixture.componentRef.setInput("controlErrors", errors);
      fixture.detectChanges();

      const message = component.errorMessage();
      // The first error key is used (Object.keys returns in insertion order)
      expect(message).toBe(BASE_FORM_ERROR_MESSAGES.required);
    });

    it("should display default message for unknown error key", () => {
      const errors = { unknownError: true };
      fixture.componentRef.setInput("controlErrors", errors);
      fixture.detectChanges();

      expect(component.errorMessage()).toBe(BASE_FORM_ERROR_MESSAGES["*"]);
    });

    it("should display pattern error message with expected value", () => {
      const errors = { pattern: { expected: "^[A-Z]+$" } };
      fixture.componentRef.setInput("controlErrors", errors);
      fixture.detectChanges();

      expect(component.errorMessage()).toBe("^[A-Z]+$");
    });
  });

  describe("Custom Error Messages", () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [FormErrorMessage],
        providers: [
          {
            provide: APP_FORM_CONFIG,
            useValue: {
              customErrorMessages: {
                customError: "This is a custom error message",
                required: "Custom required message",
              },
            },
          },
        ],
      });
      fixture = TestBed.createComponent(FormErrorMessage);
      component = fixture.componentInstance;
    });

    it("should use custom error message when provided", () => {
      const errors = { customError: true };
      fixture.componentRef.setInput("controlErrors", errors);
      fixture.detectChanges();

      expect(component.errorMessage()).toBe("This is a custom error message");
    });

    it("should override base error message with custom message", () => {
      const errors = { required: true };
      fixture.componentRef.setInput("controlErrors", errors);
      fixture.detectChanges();

      expect(component.errorMessage()).toBe("Custom required message");
    });
  });

  describe("Template Rendering", () => {
    it("should render small element with error message", () => {
      const errors = { required: true };
      fixture.componentRef.setInput("controlErrors", errors);
      fixture.detectChanges();

      const smallElement: HTMLElement =
        fixture.nativeElement.querySelector("small");
      expect(smallElement).toBeTruthy();
      expect(smallElement.textContent?.trim()).toBe(
        BASE_FORM_ERROR_MESSAGES.required,
      );
    });

    it("should have control-error class on small element", () => {
      const errors = { required: true };
      fixture.componentRef.setInput("controlErrors", errors);
      fixture.detectChanges();

      const smallElement: HTMLElement =
        fixture.nativeElement.querySelector("small");
      expect(smallElement.classList.contains("control-error")).toBe(true);
    });

    it("should set title attribute with error message", () => {
      const errors = { required: true };
      fixture.componentRef.setInput("controlErrors", errors);
      fixture.detectChanges();

      const smallElement: HTMLElement =
        fixture.nativeElement.querySelector("small");
      expect(smallElement.getAttribute("title")).toBe(
        BASE_FORM_ERROR_MESSAGES.required,
      );
    });

    it("should update displayed message when errors change", () => {
      const errors1 = { required: true };
      fixture.componentRef.setInput("controlErrors", errors1);
      fixture.detectChanges();

      let smallElement: HTMLElement =
        fixture.nativeElement.querySelector("small");
      expect(smallElement.textContent?.trim()).toBe(
        BASE_FORM_ERROR_MESSAGES.required,
      );

      const errors2 = { emailInvalid: true };
      fixture.componentRef.setInput("controlErrors", errors2);
      fixture.detectChanges();

      smallElement = fixture.nativeElement.querySelector("small");
      expect(smallElement.textContent?.trim()).toBe(
        BASE_FORM_ERROR_MESSAGES.emailInvalid,
      );
    });
  });

  describe("Integration with FormControl", () => {
    it("should display error message from FormControl errors", () => {
      const control = new FormControl("", { validators: [] });
      control.setErrors({ required: true });

      fixture.componentRef.setInput("controlErrors", control.errors);
      fixture.detectChanges();

      expect(component.errorMessage()).toBe(BASE_FORM_ERROR_MESSAGES.required);
    });

    it("should handle null errors from FormControl", () => {
      const control = new FormControl("valid value");

      fixture.componentRef.setInput("controlErrors", control.errors);
      fixture.detectChanges();

      expect(component.errorMessage()).toBe("");
    });
  });
});
