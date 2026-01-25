import { ComponentFixture } from "@angular/core/testing";
import { FormArray } from "@angular/forms";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { FormComponent } from "@form/form/form.component";
import {
  createFormArrayConfig,
  createGroupConfig,
  createInputConfig,
  setupFormTest,
  TestWrapperComponent,
} from "./form.component.spec-helpers";

describe("FormComponent - Readonly Mode and Actions", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: FormComponent;

  beforeEach(async () => {
    ({ fixture, component } = await setupFormTest());
  });

  describe("Readonly Mode", () => {
    it("should create form in readonly mode", () => {
      // Arrange
      fixture.componentInstance.config = [
        createInputConfig("name", "Name"),
        createInputConfig("email", "Email"),
      ];
      fixture.componentInstance.model = {
        name: "John",
        email: "john@example.com",
      };
      fixture.componentInstance.isReadonly = true;

      // Act
      fixture.detectChanges();

      // Assert
      const form = component.form();
      expect(form?.get("name")?.disabled).toBe(true);
      expect(form?.get("email")?.disabled).toBe(true);
    });

    it("should disable all controls in readonly mode", () => {
      // Arrange
      fixture.componentInstance.config = [
        createInputConfig("firstName", "First Name"),
        createInputConfig("lastName", "Last Name"),
        createInputConfig("age", "Age"),
      ];
      fixture.componentInstance.model = {
        firstName: "John",
        lastName: "Doe",
        age: 30,
      };
      fixture.componentInstance.isReadonly = true;

      // Act
      fixture.detectChanges();

      // Assert
      const form = component.form();
      expect(form?.get("firstName")?.disabled).toBe(true);
      expect(form?.get("lastName")?.disabled).toBe(true);
      expect(form?.get("age")?.disabled).toBe(true);
    });

    it("should disable nested form groups in readonly mode", () => {
      // Arrange
      fixture.componentInstance.config = [
        createGroupConfig("address", "Address", [
          createInputConfig("street", "Street"),
          createInputConfig("city", "City"),
        ]),
      ];
      fixture.componentInstance.model = {
        address: { street: "123 Main St", city: "Paris" },
      };
      fixture.componentInstance.isReadonly = true;

      // Act
      fixture.detectChanges();

      // Assert
      const form = component.form();
      expect(form?.get("address.street")?.disabled).toBe(true);
      expect(form?.get("address.city")?.disabled).toBe(true);
    });

    it("should disable form arrays in readonly mode", () => {
      // Arrange
      fixture.componentInstance.config = [
        createFormArrayConfig("tags", "Tags"),
      ];
      fixture.componentInstance.model = {
        tags: ["tag1", "tag2", "tag3"],
      };
      fixture.componentInstance.isReadonly = true;

      // Act
      fixture.detectChanges();

      // Assert
      const form = component.form();
      const tagsArray = form?.get("tags") as FormArray;
      expect(tagsArray.disabled).toBe(true);

      // All controls in array should be disabled
      tagsArray.controls.forEach((control) => {
        expect(control.disabled).toBe(true);
      });
    });

    it("should prevent form interaction in readonly mode", () => {
      // Arrange
      fixture.componentInstance.config = [
        {
          key: "status",
          label: "Status",
          controlType: CONTROL_TYPES.INPUT,
        },
      ];
      fixture.componentInstance.model = { status: "active" };
      fixture.componentInstance.isReadonly = true;
      fixture.detectChanges();

      // Assert - Control should be disabled in readonly mode
      const form = component.form();
      const statusControl = form?.get("status");

      expect(statusControl?.disabled).toBe(true);
      expect(statusControl?.value).toBe("active");
    });

    it("should create form in edit mode when isReadonly is false", () => {
      // Arrange
      fixture.componentInstance.config = [createInputConfig("name", "Name")];
      fixture.componentInstance.model = { name: "John" };
      fixture.componentInstance.isReadonly = false;

      // Act
      fixture.detectChanges();

      // Assert - Controls should be enabled in edit mode
      const form = component.form();
      const nameControl = form?.get("name");
      expect(nameControl?.disabled).toBe(false);
      expect(nameControl?.value).toBe("John");
    });
  });

  describe("Form Actions", () => {
    it("should show reset button when showReset is true", () => {
      // Arrange
      fixture.componentInstance.config = [createInputConfig("name", "Name")];
      fixture.componentInstance.model = { name: "John" };
      fixture.componentInstance.showReset = true;

      // Act
      fixture.detectChanges();

      // Assert
      const resetButton = fixture.nativeElement.querySelector(
        '[data-testid="cancel-button"]',
      );
      expect(resetButton).toBeTruthy();
    });

    it("should show submit button when showSubmit is true", () => {
      // Arrange
      fixture.componentInstance.config = [createInputConfig("name", "Name")];
      fixture.componentInstance.model = { name: "John" };
      fixture.componentInstance.showSubmit = true;

      // Act
      fixture.detectChanges();

      // Assert
      const submitButton = fixture.nativeElement.querySelector(
        '[data-testid="validate-button"]',
      );
      expect(submitButton).toBeTruthy();
    });

    it("should emit reset event when reset button is clicked", (done) => {
      // Arrange
      fixture.componentInstance.config = [createInputConfig("name", "Name")];
      fixture.componentInstance.model = { name: "John" };
      fixture.componentInstance.showReset = true;
      fixture.detectChanges();

      // Subscribe to reset event
      component.reset.subscribe(() => {
        done();
      });

      // Act - Click reset button
      component.onReset();
    });

    it("should emit submitted event when form is submitted", (done) => {
      // Arrange
      fixture.componentInstance.config = [
        {
          key: "name",
          label: "Name",
          controlType: CONTROL_TYPES.INPUT,
          controlOptions: {
            validators: [
              (control) => (control.value ? null : { required: true }),
            ],
          },
        },
      ];
      fixture.componentInstance.model = { name: "John" };
      fixture.componentInstance.showSubmit = true;
      fixture.detectChanges();

      // Subscribe to submitted event
      component.submitted.subscribe((model) => {
        expect(model.name).toBe("John");
        done();
      });

      // Act - Submit form
      component.onSubmit();
    });

    it("should not submit invalid form", () => {
      // Arrange
      fixture.componentInstance.config = [
        {
          key: "email",
          label: "Email",
          controlType: CONTROL_TYPES.INPUT,
          controlOptions: {
            validators: [
              (control) =>
                control.value?.includes("@") ? null : { email: true },
            ],
          },
        },
      ];
      fixture.componentInstance.model = { email: "invalid" };
      fixture.componentInstance.showSubmit = true;
      fixture.detectChanges();

      let submitted = false;
      component.submitted.subscribe(() => {
        submitted = true;
      });

      // Act - Try to submit invalid form
      component.onSubmit();

      // Assert - Should not emit submitted event
      expect(submitted).toBe(false);
    });
  });
});
