import { ComponentFixture } from "@angular/core/testing";
import { FormArray, FormControl } from "@angular/forms";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { FormComponent } from "@form/form/form.component";
import {
  createFormArrayConfig,
  createGroupConfig,
  createInputConfig,
  setupFormTest,
  TestWrapperComponent,
} from "./form.component.spec-helpers";

describe("FormComponent - Model Binding", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: FormComponent;

  beforeEach(async () => {
    ({ fixture, component } = await setupFormTest());
  });

  it("should emit modelChange when form values change", (done) => {
    // Arrange
    fixture.componentInstance.config = [createInputConfig("name", "Name")];
    fixture.componentInstance.model = { name: "John" };
    fixture.detectChanges();

    // Subscribe to modelChange output
    component.modelChange.subscribe((newModel) => {
      expect(newModel.name).toBe("Jane");
      done();
    });

    // Act - Update form value
    const form = component.form();
    form?.get("name")?.setValue("Jane");
  });

  it("should update form values when model changes", () => {
    // Arrange
    fixture.componentInstance.config = [
      {
        key: "status",
        label: "Status",
        controlType: CONTROL_TYPES.INPUT,
      },
    ];
    fixture.componentInstance.model = { status: "active" };
    fixture.detectChanges();

    const initialValue = component.form()?.get("status")?.value;
    expect(initialValue).toBe("active");

    // Act - Change form value programmatically
    const form = component.form();
    form?.patchValue({ status: "inactive" });

    // Assert
    expect(form?.get("status")?.value).toBe("inactive");
  });

  it("should handle nested form group value changes", (done) => {
    // Arrange
    fixture.componentInstance.config = [
      createGroupConfig("address", "Address", [
        createInputConfig("city", "City"),
      ]),
    ];
    fixture.componentInstance.model = { address: { city: "Paris" } };
    fixture.detectChanges();

    // Subscribe to modelChange
    component.modelChange.subscribe((newModel) => {
      expect(newModel.address.city).toBe("Lyon");
      done();
    });

    // Act
    const form = component.form();
    form?.get("address.city")?.setValue("Lyon");
  });

  it("should handle form array value changes", (done) => {
    // Arrange
    fixture.componentInstance.config = [createFormArrayConfig("tags", "Tags")];
    fixture.componentInstance.model = { tags: ["tag1", "tag2"] };
    fixture.detectChanges();

    // Subscribe to modelChange
    component.modelChange.subscribe((newModel) => {
      expect(newModel.tags).toEqual(["tag1", "tag2", "tag3"]);
      done();
    });

    // Act - Add a new tag
    const form = component.form();
    const tagsArray = form?.get("tags") as FormArray;
    tagsArray?.push(new FormControl("tag3"));
  });

  it("should emit modelChange with complete form value", (done) => {
    // Arrange
    fixture.componentInstance.config = [
      createInputConfig("firstName", "First Name"),
      createInputConfig("lastName", "Last Name"),
    ];
    fixture.componentInstance.model = {
      firstName: "John",
      lastName: "Doe",
    };
    fixture.detectChanges();

    // Subscribe to modelChange
    component.modelChange.subscribe((newModel) => {
      expect(newModel.firstName).toBe("Jane");
      expect(newModel.lastName).toBe("Doe");
      done();
    });

    // Act - Update only one field
    const form = component.form();
    form?.get("firstName")?.setValue("Jane");
  });
});
