import { ComponentFixture } from "@angular/core/testing";
import { AbstractControl, FormArray } from "@angular/forms";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { FormComponent } from "@form/form/form.component";
import {
  createCheckboxConfig,
  createGroupConfig,
  createInputConfig,
  createSelectConfig,
  setupFormTest,
  TestWrapperComponent,
  waitForDebounce,
} from "@form/form/specs/form.component.spec-helpers";

describe("FormComponent - Conditional Logic", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: FormComponent;

  beforeEach(async () => {
    ({ fixture, component } = await setupFormTest());
  });

  describe("Basic Conditional Logic", () => {
    it("should have config with conditions defined", () => {
      // Arrange
      fixture.componentInstance.config = [
        createSelectConfig("userType", "User Type", [
          { label: "Individual", value: "individual" },
          { label: "Company", value: "company" },
        ]),
        {
          key: "companyName",
          label: "Company Name",
          controlType: CONTROL_TYPES.INPUT,
          conditions: {
            controlOptions: {
              hidden: ({ model }) => model.userType !== "company",
            },
          },
        },
      ];
      fixture.componentInstance.model = { userType: "individual" };
      fixture.detectChanges();

      // Assert - Verify conditions are defined
      const config = component.config();
      const companyNameConfig = config.find((c) => c.key === "companyName");
      expect(companyNameConfig?.conditions).toBeDefined();
      expect(companyNameConfig?.conditions?.controlOptions).toBeDefined();
    });

    it("should create form with conditional fields", () => {
      // Arrange
      fixture.componentInstance.config = [
        createCheckboxConfig("hasDiscount", "Has Discount"),
        {
          key: "discountAmount",
          label: "Discount Amount",
          controlType: CONTROL_TYPES.INPUT,
          controlOptions: {
            disabled: true,
          },
        },
      ];
      fixture.componentInstance.model = {
        hasDiscount: false,
        discountAmount: "",
      };
      fixture.detectChanges();

      // Assert - Form is created with both controls
      const form = component.form();
      expect(form?.get("hasDiscount")).toBeTruthy();
      expect(form?.get("discountAmount")).toBeTruthy();
      expect(form?.get("discountAmount")?.disabled).toBe(true);
    });

    it("should update form control state programmatically", () => {
      // Arrange
      fixture.componentInstance.config = [
        createInputConfig("field1", "Field 1"),
      ];
      fixture.componentInstance.model = { field1: "" };
      fixture.detectChanges();

      // Act
      const form = component.form();
      const field1Control = form?.get("field1");

      // Initially enabled
      expect(field1Control?.disabled).toBe(false);

      // Disable it
      field1Control?.disable();
      expect(field1Control?.disabled).toBe(true);

      // Enable it
      field1Control?.enable();
      expect(field1Control?.disabled).toBe(false);
    });

    it("should handle form with mixed conditional configurations", () => {
      // Arrange
      fixture.componentInstance.config = [
        createSelectConfig("mode", "Mode", [
          { label: "View", value: "view" },
          { label: "Edit", value: "edit" },
        ]),
        {
          key: "data",
          label: "Data",
          controlType: CONTROL_TYPES.INPUT,
          controlOptions: {
            disabled: false,
          },
        },
      ];
      fixture.componentInstance.model = { mode: "edit", data: "test" };
      fixture.detectChanges();

      // Assert
      const form = component.form();
      expect(form?.get("mode")).toBeTruthy();
      expect(form?.get("data")).toBeTruthy();
      expect(form?.get("data")?.value).toBe("test");
    });

    it("should support nested groups with conditions", () => {
      // Arrange
      fixture.componentInstance.config = [
        createCheckboxConfig("hasAddress", "Has Address"),
        createGroupConfig("address", "Address", [
          createInputConfig("street", "Street"),
          createInputConfig("city", "City"),
        ]),
      ];
      fixture.componentInstance.model = {
        hasAddress: true,
        address: { street: "123 Main St", city: "Paris" },
      };
      fixture.detectChanges();

      // Assert
      const form = component.form();
      expect(form?.get("address")).toBeTruthy();
      expect(form?.get("address.street")?.value).toBe("123 Main St");
      expect(form?.get("address.city")?.value).toBe("Paris");
    });
  });

  describe("Advanced Conditional Logic", () => {
    it("should apply condition with validators", async () => {
      // Arrange
      fixture.componentInstance.config = [
        createInputConfig("age", "Age"),
        {
          key: "parentConsent",
          label: "Parent Consent",
          controlType: CONTROL_TYPES.CHECKBOX,
          conditions: {
            controlOptions: {
              validators: ({ model }) => {
                return model.age < 18
                  ? [
                      (control: AbstractControl) =>
                        control.value ? null : { required: true },
                    ]
                  : [];
              },
            },
          },
        },
      ];
      fixture.componentInstance.model = { age: 15, parentConsent: false };
      fixture.detectChanges();

      // Wait for debounce and check validity
      await waitForDebounce();

      // Assert - Validator should be applied for age < 18
      const form = component.form();
      const consentControl = form?.get("parentConsent");

      expect(consentControl?.invalid).toBe(true);
      expect(consentControl?.errors).toEqual({ required: true });

      // Set consent to true
      consentControl?.setValue(true);
      expect(consentControl?.valid).toBe(true);
    });

    it("should apply condition with asyncValidators", async () => {
      // Arrange
      const asyncValidator = (control: AbstractControl) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(control.value === "taken" ? { taken: true } : null);
          }, 100);
        });
      };

      fixture.componentInstance.config = [
        createCheckboxConfig("checkAvailability", "Check Availability"),
        {
          key: "username",
          label: "Username",
          controlType: CONTROL_TYPES.INPUT,
          conditions: {
            controlOptions: {
              asyncValidators: ({ model }) => {
                return model.checkAvailability ? [asyncValidator] : [];
              },
            },
          },
        },
      ];
      fixture.componentInstance.model = {
        checkAvailability: true,
        username: "",
      };
      fixture.detectChanges();

      // Act
      const form = component.form();
      const usernameControl = form?.get("username");
      usernameControl?.setValue("taken");

      // Wait for async validation
      await waitForDebounce(450);

      expect(usernameControl?.errors).toEqual({ taken: true });
    });

    it("should apply condition with hidden on FormControl", async () => {
      // Arrange
      fixture.componentInstance.config = [
        createCheckboxConfig("showOptional", "Show Optional"),
        {
          key: "optionalField",
          label: "Optional Field",
          controlType: CONTROL_TYPES.INPUT,
          conditions: {
            controlOptions: {
              hidden: ({ model }) => !model.showOptional,
            },
          },
        },
      ];
      fixture.componentInstance.model = {
        showOptional: true,
        optionalField: "initial value",
      };
      fixture.detectChanges();

      const form = component.form();
      const optionalControl = form?.get("optionalField");
      const showOptionalControl = form?.get("showOptional");

      // Initially visible with value
      expect(optionalControl?.value).toBe("initial value");

      // Act - Hide the field
      showOptionalControl?.setValue(false);

      // Wait for condition evaluation
      await waitForDebounce();

      // Hidden control should have been reset
      expect(optionalControl?.value).toBeNull();
    });

    it("should apply condition with hidden on FormArray", async () => {
      // Arrange
      fixture.componentInstance.config = [
        createCheckboxConfig("hasItems", "Has Items"),
        {
          key: "items",
          label: "Items",
          controlType: CONTROL_TYPES.INPUT,
          controlOptions: {
            isFormArray: true,
          },
          conditions: {
            controlOptions: {
              hidden: ({ model }) => !model.hasItems,
            },
          },
        },
      ];
      fixture.componentInstance.model = {
        hasItems: true,
        items: ["item1", "item2", "item3"],
      };
      fixture.detectChanges();

      const form = component.form();
      const itemsArray = form?.get("items") as FormArray;
      const hasItemsControl = form?.get("hasItems");

      // Initially visible with items
      expect(itemsArray?.length).toBe(3);

      // Act - Hide the items
      hasItemsControl?.setValue(false);

      // Wait for condition evaluation
      await waitForDebounce();

      // Hidden FormArray should be cleared
      expect(itemsArray?.length).toBe(0);
      expect(itemsArray?.value).toEqual([]);
    });

    it("should apply condition with defaultValue", async () => {
      // Arrange
      fixture.componentInstance.config = [
        createSelectConfig("country", "Country", [
          { label: "France", value: "FR" },
          { label: "USA", value: "US" },
        ]),
        {
          key: "state",
          label: "State",
          controlType: CONTROL_TYPES.INPUT,
          conditions: {
            controlOptions: {
              defaultValue: ({ model }) => {
                return model.country === "US" ? "California" : "";
              },
            },
          },
        },
      ];
      fixture.componentInstance.model = {
        country: "US",
        state: "",
      };
      fixture.detectChanges();

      // Wait for condition evaluation
      await waitForDebounce();

      const form = component.form();
      const stateControl = form?.get("state");
      expect(stateControl?.value).toBe("California");
    });

    it("should apply condition with disabled", async () => {
      // Arrange
      fixture.componentInstance.config = [
        createCheckboxConfig("editMode", "Edit Mode"),
        {
          key: "data",
          label: "Data",
          controlType: CONTROL_TYPES.INPUT,
          conditions: {
            controlOptions: {
              disabled: ({ model }) => !model.editMode,
            },
          },
        },
      ];
      fixture.componentInstance.model = {
        editMode: false,
        data: "test",
      };
      fixture.detectChanges();

      // Wait for condition evaluation
      await waitForDebounce();

      const form = component.form();
      const dataControl = form?.get("data");
      expect(dataControl?.disabled).toBe(true);
    });

    it("should handle nested conditions on children", () => {
      // Arrange
      fixture.componentInstance.config = [
        createCheckboxConfig("showAddress", "Show Address"),
        createGroupConfig("address", "Address", [
          {
            key: "street",
            label: "Street",
            controlType: CONTROL_TYPES.INPUT,
            conditions: {
              controlOptions: {
                validators: ({ model }) => {
                  return model.showAddress
                    ? [
                        (control: AbstractControl) =>
                          control.value ? null : { required: true },
                      ]
                    : [];
                },
              },
            },
          },
          {
            key: "city",
            label: "City",
            controlType: CONTROL_TYPES.INPUT,
            conditions: {
              controlOptions: {
                disabled: ({ model }) => !model.showAddress,
              },
            },
          },
        ]),
      ];
      fixture.componentInstance.model = {
        showAddress: false,
        address: { street: "", city: "Paris" },
      };
      fixture.detectChanges();

      // Assert - Verify config has nested conditions defined
      const form = component.form();
      const config = component.config();
      const addressConfig = config.find((c) => c.key === "address");
      const streetConfig = addressConfig?.children?.find(
        (c) => c.key === "street",
      );
      const cityConfig = addressConfig?.children?.find((c) => c.key === "city");

      expect(streetConfig?.conditions).toBeDefined();
      expect(cityConfig?.conditions).toBeDefined();
      expect(form?.get("address.street")).toBeTruthy();
      expect(form?.get("address.city")).toBeTruthy();
    });

    it("should re-evaluate conditions when model changes", async () => {
      // Arrange
      fixture.componentInstance.config = [
        createSelectConfig("role", "Role", [
          { label: "User", value: "user" },
          { label: "Admin", value: "admin" },
        ]),
        {
          key: "permissions",
          label: "Permissions",
          controlType: CONTROL_TYPES.INPUT,
          conditions: {
            controlOptions: {
              disabled: ({ model }) => model.role !== "admin",
            },
          },
        },
      ];
      fixture.componentInstance.model = {
        role: "user",
        permissions: "",
      };
      fixture.detectChanges();

      const form = component.form();
      const permissionsControl = form?.get("permissions");

      // Initially disabled
      await waitForDebounce();
      expect(permissionsControl?.disabled).toBe(true);

      // Change role to admin
      form?.get("role")?.setValue("admin");

      // Wait for re-evaluation
      await waitForDebounce();
      expect(permissionsControl?.disabled).toBe(false);
    });

    it("should handle multiple conditions on same control", async () => {
      // Arrange
      fixture.componentInstance.config = [
        createCheckboxConfig("enableField", "Enable Field"),
        createCheckboxConfig("requireField", "Require Field"),
        {
          key: "dynamicField",
          label: "Dynamic Field",
          controlType: CONTROL_TYPES.INPUT,
          conditions: {
            controlOptions: {
              disabled: ({ model }) => !model.enableField,
              validators: ({ model }) => {
                return model.requireField
                  ? [
                      (control: AbstractControl) =>
                        control.value ? null : { required: true },
                    ]
                  : [];
              },
            },
          },
        },
      ];
      fixture.componentInstance.model = {
        enableField: true,
        requireField: true,
        dynamicField: "",
      };
      fixture.detectChanges();

      // Wait for condition evaluation
      await waitForDebounce();

      const form = component.form();
      const dynamicControl = form?.get("dynamicField");

      expect(dynamicControl?.disabled).toBe(false);
      expect(dynamicControl?.invalid).toBe(true);
      expect(dynamicControl?.errors).toEqual({ required: true });
    });

    it("should apply conditions on deeply nested structures", () => {
      // Arrange
      fixture.componentInstance.config = [
        createCheckboxConfig("showCompany", "Show Company"),
        createGroupConfig("company", "Company", [
          createInputConfig("name", "Company Name"),
          createGroupConfig("address", "Address", [
            {
              key: "street",
              label: "Street",
              controlType: CONTROL_TYPES.INPUT,
              conditions: {
                controlOptions: {
                  validators: ({ model }) => {
                    return model.showCompany
                      ? [
                          (control: AbstractControl) =>
                            control.value ? null : { required: true },
                        ]
                      : [];
                  },
                },
              },
            },
          ]),
        ]),
      ];
      fixture.componentInstance.model = {
        showCompany: false,
        company: {
          name: "Tech Corp",
          address: {
            street: "",
          },
        },
      };
      fixture.detectChanges();

      // Assert - Verify deeply nested structure is created with conditions
      const form = component.form();
      const config = component.config();
      const companyConfig = config.find((c) => c.key === "company");
      const addressConfig = companyConfig?.children?.find(
        (c) => c.key === "address",
      );
      const streetConfig = addressConfig?.children?.find(
        (c) => c.key === "street",
      );

      expect(streetConfig?.conditions).toBeDefined();
      expect(form?.get("company")).toBeTruthy();
      expect(form?.get("company.name")).toBeTruthy();
      expect(form?.get("company.address")).toBeTruthy();
      expect(form?.get("company.address.street")).toBeTruthy();
    });
  });
});
