import { ComponentFixture } from "@angular/core/testing";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { FormComponent } from "@form/form/form.component";
import {
  createFormArrayConfig,
  createGroupConfig,
  createInputConfig,
  createSelectConfig,
  setupFormTest,
  TestWrapperComponent,
} from "./form.component.spec-helpers";

describe("FormComponent - Form Creation", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: FormComponent;

  beforeEach(async () => {
    ({ fixture, component } = await setupFormTest());
  });

  it("should create form from config on ngOnInit", () => {
    // Arrange
    fixture.componentInstance.config = [
      createInputConfig("name", "Name"),
      createInputConfig("email", "Email"),
    ];
    fixture.componentInstance.model = {
      name: "John",
      email: "john@example.com",
    };

    // Act
    fixture.detectChanges();

    // Assert
    const form = component.form();
    expect(form).toBeTruthy();
    expect(form?.get("name")).toBeTruthy();
    expect(form?.get("email")).toBeTruthy();
    expect(form?.get("name")?.value).toBe("John");
    expect(form?.get("email")?.value).toBe("john@example.com");
  });

  it("should set initial values from model", () => {
    // Arrange
    fixture.componentInstance.config = [
      createInputConfig("username", "Username"),
      createInputConfig("age", "Age"),
    ];
    fixture.componentInstance.model = { username: "johndoe", age: 30 };

    // Act
    fixture.detectChanges();

    // Assert
    const form = component.form();
    expect(form?.get("username")?.value).toBe("johndoe");
    expect(form?.get("age")?.value).toBe(30);
  });

  it("should handle empty config gracefully", () => {
    // Arrange
    fixture.componentInstance.config = [];
    fixture.componentInstance.model = {};

    // Act
    fixture.detectChanges();

    // Assert
    const form = component.form();
    expect(form).toBeTruthy();
    expect(Object.keys(form?.controls || {}).length).toBe(0);
  });

  it("should create nested form groups for children", () => {
    // Arrange
    fixture.componentInstance.config = [
      createGroupConfig("address", "Address", [
        createInputConfig("street", "Street"),
        createInputConfig("city", "City"),
        createInputConfig("zipCode", "Zip Code"),
      ]),
    ];
    fixture.componentInstance.model = {
      address: {
        street: "123 Main St",
        city: "Paris",
        zipCode: "75001",
      },
    };

    // Act
    fixture.detectChanges();

    // Assert
    const form = component.form();
    const addressGroup = form?.get("address");

    expect(addressGroup).toBeTruthy();
    expect(addressGroup?.get("street")).toBeTruthy();
    expect(addressGroup?.get("city")).toBeTruthy();
    expect(addressGroup?.get("zipCode")).toBeTruthy();

    expect(addressGroup?.get("street")?.value).toBe("123 Main St");
    expect(addressGroup?.get("city")?.value).toBe("Paris");
    expect(addressGroup?.get("zipCode")?.value).toBe("75001");
  });

  it("should create form arrays when isFormArray is true", () => {
    // Arrange
    fixture.componentInstance.config = [createFormArrayConfig("tags", "Tags")];
    fixture.componentInstance.model = {
      tags: ["javascript", "typescript", "angular"],
    };

    // Act
    fixture.detectChanges();

    // Assert
    const form = component.form();
    const tagsArray = form?.get("tags");

    expect(tagsArray).toBeTruthy();
    expect(tagsArray?.value).toEqual(["javascript", "typescript", "angular"]);
  });

  it("should create multiple nested form groups", () => {
    // Arrange
    fixture.componentInstance.config = [
      createGroupConfig("personalInfo", "Personal Info", [
        createInputConfig("firstName", "First Name"),
        createInputConfig("lastName", "Last Name"),
      ]),
      createGroupConfig("contactInfo", "Contact Info", [
        createInputConfig("email", "Email"),
        createInputConfig("phone", "Phone"),
      ]),
    ];
    fixture.componentInstance.model = {
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
      },
      contactInfo: {
        email: "john@example.com",
        phone: "+33123456789",
      },
    };

    // Act
    fixture.detectChanges();

    // Assert
    const form = component.form();
    const personalInfo = form?.get("personalInfo");
    const contactInfo = form?.get("contactInfo");

    expect(personalInfo).toBeTruthy();
    expect(contactInfo).toBeTruthy();

    expect(personalInfo?.get("firstName")?.value).toBe("John");
    expect(personalInfo?.get("lastName")?.value).toBe("Doe");
    expect(contactInfo?.get("email")?.value).toBe("john@example.com");
    expect(contactInfo?.get("phone")?.value).toBe("+33123456789");
  });

  it("should handle form with mixed control types", () => {
    // Arrange
    fixture.componentInstance.config = [
      createInputConfig("name", "Name"),
      createGroupConfig("settings", "Settings", [
        createSelectConfig("theme", "Theme", [
          { label: "Light", value: "light" },
          { label: "Dark", value: "dark" },
        ]),
      ]),
      createFormArrayConfig("tags", "Tags"),
    ];
    fixture.componentInstance.model = {
      name: "User",
      settings: {
        theme: "dark",
      },
      tags: ["tag1", "tag2"],
    };

    // Act
    fixture.detectChanges();

    // Assert
    const form = component.form();

    expect(form?.get("name")).toBeTruthy();
    expect(form?.get("settings")).toBeTruthy();
    expect(form?.get("tags")).toBeTruthy();

    expect(form?.get("name")?.value).toBe("User");
    expect(form?.get("settings.theme")?.value).toBe("dark");
    expect(form?.get("tags")?.value).toEqual(["tag1", "tag2"]);
  });

  it("should use default values when model values are undefined", () => {
    // Arrange
    fixture.componentInstance.config = [
      {
        key: "status",
        label: "Status",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          defaultValue: "active",
        },
      },
      {
        key: "role",
        label: "Role",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          defaultValue: "user",
        },
      },
    ];
    fixture.componentInstance.model = {};

    // Act
    fixture.detectChanges();

    // Assert
    const form = component.form();

    expect(form?.get("status")?.value).toBe("active");
    expect(form?.get("role")?.value).toBe("user");
  });

  it("should handle empty arrays in form arrays", () => {
    // Arrange
    fixture.componentInstance.config = [
      createFormArrayConfig("items", "Items"),
    ];
    fixture.componentInstance.model = {
      items: [],
    };

    // Act
    fixture.detectChanges();

    // Assert
    const form = component.form();
    const itemsArray = form?.get("items");

    expect(itemsArray).toBeTruthy();
    expect(itemsArray?.value).toEqual([]);
  });

  it("should create form with deeply nested structure", () => {
    // Arrange
    fixture.componentInstance.config = [
      createGroupConfig("company", "Company", [
        createInputConfig("name", "Company Name"),
        createGroupConfig("address", "Address", [
          createInputConfig("street", "Street"),
          createInputConfig("city", "City"),
        ]),
      ]),
    ];
    fixture.componentInstance.model = {
      company: {
        name: "Tech Corp",
        address: {
          street: "123 Tech Street",
          city: "San Francisco",
        },
      },
    };

    // Act
    fixture.detectChanges();

    // Assert
    const form = component.form();

    expect(form?.get("company")).toBeTruthy();
    expect(form?.get("company.name")?.value).toBe("Tech Corp");
    expect(form?.get("company.address")).toBeTruthy();
    expect(form?.get("company.address.street")?.value).toBe("123 Tech Street");
    expect(form?.get("company.address.city")?.value).toBe("San Francisco");
  });
});
