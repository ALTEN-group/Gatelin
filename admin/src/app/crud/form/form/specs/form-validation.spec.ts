import { ComponentFixture } from "@angular/core/testing";
import { AbstractControl } from "@angular/forms";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { FormComponent } from "@form/form/form.component";
import {
  createGroupConfig,
  createInputConfig,
  setupFormTest,
  TestWrapperComponent,
} from "./form.component.spec-helpers";

describe("FormComponent - Validation", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: FormComponent;

  beforeEach(async () => {
    ({ fixture, component } = await setupFormTest());
  });

  it("should apply validators to form controls", () => {
    // Arrange
    fixture.componentInstance.config = [
      {
        key: "email",
        label: "Email",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          validators: [
            (control) => {
              const value = control.value;
              return value?.includes("@") ? null : { email: true };
            },
          ],
        },
      },
    ];
    fixture.componentInstance.model = { email: "" };
    fixture.detectChanges();

    // Act & Assert
    const form = component.form();
    const emailControl = form?.get("email");

    // Invalid email
    emailControl?.setValue("invalid");
    expect(emailControl?.invalid).toBe(true);
    expect(emailControl?.errors).toEqual({ email: true });

    // Valid email
    emailControl?.setValue("test@example.com");
    expect(emailControl?.valid).toBe(true);
    expect(emailControl?.errors).toBeNull();
  });

  it("should apply multiple validators to a control", () => {
    // Arrange
    fixture.componentInstance.config = [
      {
        key: "password",
        label: "Password",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          validators: [
            (control) =>
              control.value?.length >= 8 ? null : { minLength: true },
            (control) =>
              /[A-Z]/.test(control.value) ? null : { uppercase: true },
          ],
        },
      },
    ];
    fixture.componentInstance.model = { password: "" };
    fixture.detectChanges();

    // Act & Assert
    const form = component.form();
    const passwordControl = form?.get("password");

    // Too short
    passwordControl?.setValue("short");
    expect(passwordControl?.invalid).toBe(true);
    expect(passwordControl?.errors).toEqual({
      minLength: true,
      uppercase: true,
    });

    // Long enough but no uppercase
    passwordControl?.setValue("longpassword");
    expect(passwordControl?.invalid).toBe(true);
    expect(passwordControl?.errors).toEqual({ uppercase: true });

    // Valid
    passwordControl?.setValue("LongPassword");
    expect(passwordControl?.valid).toBe(true);
  });

  it("should emit validityChange when form validity changes", (done) => {
    // Arrange
    fixture.componentInstance.config = [
      {
        key: "required",
        label: "Required",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          validators: [
            (control) => (control.value ? null : { required: true }),
          ],
        },
      },
    ];
    fixture.componentInstance.model = { required: "" };
    fixture.detectChanges();

    let emissionCount = 0;
    component.validityChange.subscribe((isValid) => {
      emissionCount++;
      if (emissionCount === 1) {
        expect(isValid).toBe(true);
        done();
      }
    });

    // Act - Set valid value
    const form = component.form();
    form?.get("required")?.setValue("value");
  });

  it("should validate nested form groups", () => {
    // Arrange
    fixture.componentInstance.config = [
      createGroupConfig("address", "Address", [
        {
          key: "street",
          label: "Street",
          controlType: CONTROL_TYPES.INPUT,
          controlOptions: {
            validators: [
              (control) => (control.value ? null : { required: true }),
            ],
          },
        },
      ]),
    ];
    fixture.componentInstance.model = { address: { street: "" } };
    fixture.detectChanges();

    // Act & Assert
    const form = component.form();
    const streetControl = form?.get("address.street");

    expect(streetControl?.invalid).toBe(true);
    expect(form?.invalid).toBe(true);

    streetControl?.setValue("123 Main St");
    expect(streetControl?.valid).toBe(true);
    expect(form?.valid).toBe(true);
  });

  it("should apply group validators to the entire form", () => {
    // Arrange
    fixture.componentInstance.config = [
      createInputConfig("password", "Password"),
      createInputConfig("confirmPassword", "Confirm Password"),
    ];
    fixture.componentInstance.model = { password: "", confirmPassword: "" };

    // Set group validator via wrapper component
    const groupValidator = (group: AbstractControl) => {
      const password = group.get("password")?.value;
      const confirmPassword = group.get("confirmPassword")?.value;
      return password === confirmPassword
        ? null
        : { passwordMismatch: { message: "Passwords do not match" } };
    };

    // Act
    fixture.detectChanges();
    const form = component.form();
    form?.setValidators(groupValidator);
    form?.updateValueAndValidity();

    // Assert - Different passwords
    form?.patchValue({ password: "pass123", confirmPassword: "pass456" });
    expect(form?.invalid).toBe(true);
    expect(form?.errors).toEqual({
      passwordMismatch: { message: "Passwords do not match" },
    });

    // Same passwords
    form?.patchValue({ password: "pass123", confirmPassword: "pass123" });
    expect(form?.valid).toBe(true);
    expect(form?.errors).toBeNull();
  });

  it("should display form errors", () => {
    // Arrange
    fixture.componentInstance.config = [createInputConfig("field1", "Field 1")];
    fixture.componentInstance.model = { field1: "" };
    fixture.detectChanges();

    // Act - Set group validator with error message
    const form = component.form();
    form?.setValidators(() => ({
      customError: { message: "Custom error: {field}" },
    }));
    form?.updateValueAndValidity();

    // Assert
    const formErrors = component.formErrors;
    expect(formErrors).toBeTruthy();
    expect(formErrors).toContain("Custom error");
  });
});
