import { FormControl, FormGroup } from "@angular/forms";
import { PasswordConfirmValidator } from "./password-confirm.validator";
import { PasswordStrengthValidator } from "./password-strength.validator";

describe("PasswordStrengthValidator", () => {
  it("returns null for an empty value", () => {
    expect(PasswordStrengthValidator(new FormControl(""))).toBeNull();
  });

  it("requires an uppercase letter", () => {
    expect(PasswordStrengthValidator(new FormControl("abcdefg1!"))).toEqual({
      passwordStrength: "Doit contenir au moins une majuscule",
    });
  });

  it("requires a lowercase letter", () => {
    expect(PasswordStrengthValidator(new FormControl("ABCDEFG1!"))).toEqual({
      passwordStrength: "Doit contenir au moins une minuscule",
    });
  });

  it("requires a number", () => {
    expect(PasswordStrengthValidator(new FormControl("Abcdefg!"))).toEqual({
      passwordStrength: "Doit contenir au moins un chiffre",
    });
  });

  it("requires a special character", () => {
    expect(PasswordStrengthValidator(new FormControl("Abcdefg1"))).toEqual({
      passwordStrength: "Doit contenir au moins un caractère special",
    });
  });

  it("requires at least 8 characters", () => {
    expect(PasswordStrengthValidator(new FormControl("Ab1!x"))).toEqual({
      passwordStrength: "Doit contenir au moins 8 caractères",
    });
  });

  it("rejects passwords longer than 20 characters", () => {
    expect(
      PasswordStrengthValidator(new FormControl("Abcdefg1!Abcdefg1!xxx")),
    ).toEqual({
      passwordStrength: "Doit contenir au maximum 20 caractères",
    });
  });

  it("accepts a strong password at the length boundaries", () => {
    expect(PasswordStrengthValidator(new FormControl("Abcdefg1!"))).toBeNull();
    expect(
      PasswordStrengthValidator(new FormControl("Abcdefg1!Abcdefg1!")),
    ).toBeNull();
  });
});

describe("PasswordConfirmValidator", () => {
  it("returns null when passwords match", () => {
    const group = new FormGroup(
      {
        password: new FormControl("Abcdefg1!"),
        passwordConfirm: new FormControl("Abcdefg1!"),
      },
      { validators: PasswordConfirmValidator },
    );

    expect(group.errors).toBeNull();
  });

  it("flags mismatched passwords", () => {
    const group = new FormGroup(
      {
        password: new FormControl("Abcdefg1!"),
        passwordConfirm: new FormControl("Different1!"),
      },
      { validators: PasswordConfirmValidator },
    );

    expect(group.errors).toEqual({ notEqual: "Mots de passe différents" });
  });

  it("returns null when either control is missing", () => {
    const withoutConfirm = new FormGroup(
      { password: new FormControl("Abcdefg1!") },
      { validators: PasswordConfirmValidator },
    );
    const withoutPassword = new FormGroup(
      { passwordConfirm: new FormControl("Abcdefg1!") },
      { validators: PasswordConfirmValidator },
    );

    expect(withoutConfirm.errors).toBeNull();
    expect(withoutPassword.errors).toBeNull();
  });
});
