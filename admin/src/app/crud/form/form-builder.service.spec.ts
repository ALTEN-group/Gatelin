import { TestBed } from "@angular/core/testing";
import { AbstractControl, Validators } from "@angular/forms";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { TypedValidationErrors } from "@form/utils/group-validator.model";
import { FormBuilderService } from "./form-builder.service";

describe("FormBuilderService", () => {
  let service: FormBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilderService],
    });
    service = TestBed.inject(FormBuilderService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("toFormGroup", () => {
    it("should create an empty FormGroup when items array is empty", () => {
      const formGroup = service.toFormGroup([], {}, undefined, false);

      expect(formGroup).toBeTruthy();
      expect(Object.keys(formGroup.controls).length).toBe(0);
    });

    it("should create FormGroup with simple text control", () => {
      const config: CrudItemOptions[] = [
        {
          key: "name",
          label: "Name",
          controlType: CONTROL_TYPES.INPUT,
        },
      ];
      const values = { name: "John" };

      const formGroup = service.toFormGroup(config, values, undefined, false);

      expect(formGroup.get("name")).toBeTruthy();
      expect(formGroup.get("name")?.value).toBe("John");
    });

    it("should create FormGroup with multiple controls", () => {
      const config: CrudItemOptions[] = [
        { key: "name", label: "Name", controlType: CONTROL_TYPES.INPUT },
        { key: "age", label: "Age", controlType: CONTROL_TYPES.INPUT },
        { key: "email", label: "Email", controlType: CONTROL_TYPES.INPUT },
      ];
      const values = { name: "John", age: 30, email: "john@example.com" };

      const formGroup = service.toFormGroup(config, values, undefined, false);

      expect(formGroup.get("name")?.value).toBe("John");
      expect(formGroup.get("age")?.value).toBe(30);
      expect(formGroup.get("email")?.value).toBe("john@example.com");
    });

    it("should create nested FormGroup when children are present", () => {
      const config: CrudItemOptions[] = [
        {
          key: "address",
          label: "Address",
          controlType: CONTROL_TYPES.INPUT,
          children: [
            {
              key: "street",
              label: "Street",
              controlType: CONTROL_TYPES.INPUT,
            },
            { key: "city", label: "City", controlType: CONTROL_TYPES.INPUT },
          ],
        },
      ];
      const values = {
        address: {
          street: "123 Main St",
          city: "Paris",
        },
      };

      const formGroup = service.toFormGroup(config, values, undefined, false);

      const addressGroup = formGroup.get("address");
      expect(addressGroup).toBeTruthy();
      expect(addressGroup?.get("street")?.value).toBe("123 Main St");
      expect(addressGroup?.get("city")?.value).toBe("Paris");
    });

    it("should create FormArray when isFormArray is true", () => {
      const config: CrudItemOptions[] = [
        {
          key: "tags",
          label: "Tags",
          controlType: CONTROL_TYPES.INPUT,
          controlOptions: { isFormArray: true },
        },
      ];
      const values = { tags: ["tag1", "tag2", "tag3"] };

      const formGroup = service.toFormGroup(config, values, undefined, false);

      const tagsArray = formGroup.get("tags");
      expect(tagsArray).toBeTruthy();
      expect(tagsArray?.value).toEqual(["tag1", "tag2", "tag3"]);
    });

    it("should apply group validator when provided", () => {
      const config: CrudItemOptions[] = [
        {
          key: "password",
          label: "Password",
          controlType: CONTROL_TYPES.INPUT,
        },
        {
          key: "confirmPassword",
          label: "Confirm Password",
          controlType: CONTROL_TYPES.INPUT,
        },
      ];
      const values = { password: "pass123", confirmPassword: "pass456" };
      const groupValidator = (
        group: AbstractControl,
      ): TypedValidationErrors | null => {
        const pwd = group.get("password")?.value;
        const confirm = group.get("confirmPassword")?.value;
        return pwd === confirm
          ? null
          : { passwordMismatch: { message: "Passwords do not match" } };
      };

      const formGroup = service.toFormGroup(
        config,
        values,
        groupValidator,
        false,
      );

      // Force validation to run
      formGroup.updateValueAndValidity();

      expect(formGroup.errors).toBeTruthy();
      expect(formGroup.errors?.passwordMismatch).toBeDefined();
      expect(formGroup.errors?.passwordMismatch.message).toBe(
        "Passwords do not match",
      );
    });

    it("should disable all controls when isReadonlyMode is true", () => {
      const config: CrudItemOptions[] = [
        { key: "name", label: "Name", controlType: CONTROL_TYPES.INPUT },
        { key: "email", label: "Email", controlType: CONTROL_TYPES.INPUT },
      ];
      const values = { name: "John", email: "john@example.com" };

      const formGroup = service.toFormGroup(config, values, undefined, true);

      expect(formGroup.get("name")?.disabled).toBe(true);
      expect(formGroup.get("email")?.disabled).toBe(true);
    });

    it("should use default value when no value is provided", () => {
      const config: CrudItemOptions[] = [
        {
          key: "status",
          label: "Status",
          controlType: CONTROL_TYPES.INPUT,
          controlOptions: { defaultValue: "active" },
        },
      ];
      const values = {};

      const formGroup = service.toFormGroup(config, values, undefined, false);

      expect(formGroup.get("status")?.value).toBe("active");
    });

    it("should use default value when value is empty string", () => {
      const config: CrudItemOptions[] = [
        {
          key: "status",
          label: "Status",
          controlType: CONTROL_TYPES.INPUT,
          controlOptions: { defaultValue: "pending" },
        },
      ];
      const values = { status: "" };

      const formGroup = service.toFormGroup(config, values, undefined, false);

      expect(formGroup.get("status")?.value).toBe("pending");
    });
  });

  describe("toFormControl", () => {
    it("should create FormControl with given value", () => {
      const config: CrudItemOptions = {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
      };

      const control = service.toFormControl(config, "John", false);

      expect(control.value).toBe("John");
      expect(control.disabled).toBe(false);
    });

    it("should create disabled FormControl when isReadonlyMode is true", () => {
      const config: CrudItemOptions = {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
      };

      const control = service.toFormControl(config, "John", true);

      expect(control.disabled).toBe(true);
    });

    it("should create disabled FormControl when disabled option is true", () => {
      const config: CrudItemOptions = {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: { disabled: true },
      };

      const control = service.toFormControl(config, "John", false);

      expect(control.disabled).toBe(true);
    });

    it("should apply validators to FormControl", () => {
      const config: CrudItemOptions = {
        key: "email",
        label: "Email",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          validators: [Validators.required, Validators.email],
        },
      };

      const control = service.toFormControl(config, "", false);

      expect(control.hasError("required")).toBe(true);
      control.setValue("invalid-email");
      expect(control.hasError("email")).toBe(true);
      control.setValue("valid@email.com");
      expect(control.valid).toBe(true);
    });

    it("should create non-nullable FormControl when specified", () => {
      const config: CrudItemOptions = {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: { nonNullable: true },
      };

      const control = service.toFormControl(config, "John", false);

      control.reset();
      expect(control.value).toBe("John");
    });

    it("should create nullable FormControl by default", () => {
      const config: CrudItemOptions = {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
      };

      const control = service.toFormControl(config, "John", false);

      control.reset();
      expect(control.value).toBe(null);
    });
  });

  describe("toFormArray", () => {
    it("should create FormArray with multiple controls", () => {
      const config: CrudItemOptions = {
        key: "tags",
        label: "Tags",
        controlType: CONTROL_TYPES.INPUT,
      };
      const values = ["tag1", "tag2", "tag3"];

      const formArray = service["toFormArray"](config, values, false);

      expect(formArray.length).toBe(3);
      expect(formArray.at(0).value).toBe("tag1");
      expect(formArray.at(1).value).toBe("tag2");
      expect(formArray.at(2).value).toBe("tag3");
    });

    it("should create empty FormArray when values is empty array", () => {
      const config: CrudItemOptions = {
        key: "tags",
        label: "Tags",
        controlType: CONTROL_TYPES.INPUT,
      };
      const values: unknown[] = [];

      const formArray = service["toFormArray"](config, values, false);

      expect(formArray.length).toBe(0);
    });

    it("should throw error when values is not an array", () => {
      const config: CrudItemOptions = {
        key: "tags",
        label: "Tags",
        controlType: CONTROL_TYPES.INPUT,
      };
      const values = "not-an-array";

      expect(() => {
        service["toFormArray"](config, values, false);
      }).toThrow();
    });
  });

  describe("getValue", () => {
    it("should return provided value when it exists", () => {
      const config: CrudItemOptions = {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
      };

      const value = service["getValue"](config, "John");

      expect(value).toBe("John");
    });

    it("should return default value when value is nil", () => {
      const config: CrudItemOptions = {
        key: "status",
        label: "Status",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: { defaultValue: "active" },
      };

      const value = service["getValue"](config, null);

      expect(value).toBe("active");
    });

    it("should return default value when value is empty string", () => {
      const config: CrudItemOptions = {
        key: "status",
        label: "Status",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: { defaultValue: "pending" },
      };

      const value = service["getValue"](config, "");

      expect(value).toBe("pending");
    });

    it("should return null when no value and no default", () => {
      const config: CrudItemOptions = {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
      };

      const value = service["getValue"](config, null);

      expect(value).toBe(null);
    });
  });

  describe("getFormControlOptions", () => {
    it("should return default options when no controlOptions provided", () => {
      const config: CrudItemOptions = {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
      };

      const options = service["getFormControlOptions"](config, false);

      expect(options.validators).toEqual([]);
      expect(options.asyncValidators).toEqual([]);
      expect(options.disabled).toBe(false);
      expect(options.nonNullable).toBe(false);
    });

    it("should return validators from controlOptions", () => {
      const config: CrudItemOptions = {
        key: "email",
        label: "Email",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          validators: [Validators.required, Validators.email],
        },
      };

      const options = service["getFormControlOptions"](config, false);

      expect(options.validators.length).toBe(2);
    });

    it("should return disabled true when isReadonlyMode is true", () => {
      const config: CrudItemOptions = {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
      };

      const options = service["getFormControlOptions"](config, true);

      expect(options.disabled).toBe(true);
    });

    it("should return disabled true when controlOptions.disabled is true", () => {
      const config: CrudItemOptions = {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: { disabled: true },
      };

      const options = service["getFormControlOptions"](config, false);

      expect(options.disabled).toBe(true);
    });

    it("should return nonNullable from controlOptions", () => {
      const config: CrudItemOptions = {
        key: "name",
        label: "Name",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: { nonNullable: true },
      };

      const options = service["getFormControlOptions"](config, false);

      expect(options.nonNullable).toBe(true);
    });
  });

  describe("getDisableState", () => {
    it("should return false when not disabled and not readonly", () => {
      const disabled = service["getDisableState"]({}, false);

      expect(disabled).toBe(false);
    });

    it("should return true when isReadonlyMode is true", () => {
      const disabled = service["getDisableState"]({}, true);

      expect(disabled).toBe(true);
    });

    it("should return true when controlOptions.disabled is true", () => {
      const disabled = service["getDisableState"]({ disabled: true }, false);

      expect(disabled).toBe(true);
    });

    it("should return true when both are true", () => {
      const disabled = service["getDisableState"]({ disabled: true }, true);

      expect(disabled).toBe(true);
    });
  });

  describe("getValidators", () => {
    it("should return empty array when no validators", () => {
      const validators = service["getValidators"]({});

      expect(validators).toEqual([]);
    });

    it("should return validators array when provided", () => {
      const validatorFns = [Validators.required, Validators.email];
      const validators = service["getValidators"]({ validators: validatorFns });

      expect(validators).toEqual(validatorFns);
    });

    it("should return empty array when validators array is empty", () => {
      const validators = service["getValidators"]({ validators: [] });

      expect(validators).toEqual([]);
    });
  });

  describe("getAsyncValidators", () => {
    it("should return empty array when no async validators", () => {
      const asyncValidators = service["getAsyncValidators"]({});

      expect(asyncValidators).toEqual([]);
    });

    it("should return async validators array when provided", () => {
      const asyncValidatorFns = [jasmine.createSpy("asyncValidator")];
      const asyncValidators = service["getAsyncValidators"]({
        asyncValidators: asyncValidatorFns,
      });

      expect(asyncValidators).toEqual(asyncValidatorFns);
    });

    it("should return empty array when async validators array is empty", () => {
      const asyncValidators = service["getAsyncValidators"]({
        asyncValidators: [],
      });

      expect(asyncValidators).toEqual([]);
    });
  });

  describe("Integration Tests", () => {
    it("should create complex nested form structure", () => {
      const config: CrudItemOptions[] = [
        {
          key: "user",
          label: "User",
          controlType: CONTROL_TYPES.INPUT,
          children: [
            {
              key: "name",
              label: "Name",
              controlType: CONTROL_TYPES.INPUT,
              controlOptions: {
                validators: [Validators.required],
                defaultValue: "Anonymous",
              },
            },
            {
              key: "contacts",
              label: "Contacts",
              controlType: CONTROL_TYPES.INPUT,
              controlOptions: { isFormArray: true },
            },
          ],
        },
        {
          key: "preferences",
          label: "Preferences",
          controlType: CONTROL_TYPES.SELECT,
          options: [
            { label: "Theme Light", value: "light" },
            { label: "Theme Dark", value: "dark" },
          ],
        },
      ];
      const values = {
        user: {
          name: "John",
          contacts: ["email@example.com", "phone"],
        },
        preferences: "dark",
      };

      const formGroup = service.toFormGroup(config, values, undefined, false);

      expect(formGroup.get("user.name")?.value).toBe("John");
      expect(formGroup.get("user.contacts")?.value).toEqual([
        "email@example.com",
        "phone",
      ]);
      expect(formGroup.get("preferences")?.value).toBe("dark");
    });

    it("should handle form with all control types", () => {
      const config: CrudItemOptions[] = [
        {
          key: "text",
          label: "Text",
          controlType: CONTROL_TYPES.INPUT,
        },
        {
          key: "select",
          label: "Select",
          controlType: CONTROL_TYPES.SELECT,
          options: [{ label: "Option 1", value: 1 }],
        },
        {
          key: "multiselect",
          label: "Multi Select",
          controlType: CONTROL_TYPES.MULTISELECT,
          options: [
            { label: "Tag 1", value: 1 },
            { label: "Tag 2", value: 2 },
          ],
        },
        {
          key: "checkbox",
          label: "Checkbox",
          controlType: CONTROL_TYPES.CHECKBOX,
        },
      ];
      const values = {
        text: "Hello",
        select: 1,
        multiselect: [1, 2],
        checkbox: true,
      };

      const formGroup = service.toFormGroup(config, values, undefined, false);

      expect(formGroup.get("text")?.value).toBe("Hello");
      expect(formGroup.get("select")?.value).toBe(1);
      expect(formGroup.get("multiselect")?.value).toEqual([1, 2]);
      expect(formGroup.get("checkbox")?.value).toBe(true);
    });
  });
});
