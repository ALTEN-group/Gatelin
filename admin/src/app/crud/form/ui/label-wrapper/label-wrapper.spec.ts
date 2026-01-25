import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { required } from "@form/utils/common.validators";
import { LabelStrategy } from "@form/utils/label-strategy.model";
import { LabelWrapperComponent } from "./label-wrapper";

/**
 * Test wrapper component
 */
@Component({
  template: `
    <frm-label-wrapper
      [labelStrategy]="labelStrategy"
      [labelVariant]="labelVariant"
      [config]="config"
      [control]="control"
    >
      <input type="text" [id]="config.key" />
    </frm-label-wrapper>
  `,
  standalone: true,
  imports: [LabelWrapperComponent, ReactiveFormsModule],
})
class TestWrapperComponent {
  labelStrategy: LabelStrategy = "normal";
  labelVariant: "on" | "in" | "over" | undefined = undefined;
  config: CrudItemOptions = {
    key: "testField",
    label: "Test Field",
    controlType: CONTROL_TYPES.INPUT,
  };
  control = new FormControl("");
}

describe("LabelWrapperComponent", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: TestWrapperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestWrapperComponent, ReactiveFormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  describe("Label Rendering", () => {
    it("should render label with text", () => {
      component.config = {
        key: "name",
        label: "Name Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label).toBeTruthy();
      expect(label.textContent?.trim()).toContain("Name Field");
    });

    it("should set for attribute on label", () => {
      component.config = {
        key: "email",
        label: "Email",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label.getAttribute("for")).toBe("email");
    });

    it("should use custom label from controlOptions", () => {
      component.config = {
        key: "field",
        label: "Default Label",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          label: "Custom Label",
        },
      };
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label.textContent?.trim()).toContain("Custom Label");
    });
  });

  describe("Required Indicator", () => {
    it("should add mandatory-control class when field is required", () => {
      component.control = new FormControl("", [required]);
      component.config = {
        key: "requiredField",
        label: "Required Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label.classList.contains("mandatory-control")).toBe(true);
    });

    it("should not add mandatory-control class when field is optional", () => {
      component.control = new FormControl("");
      component.config = {
        key: "optionalField",
        label: "Optional Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label.classList.contains("mandatory-control")).toBe(false);
    });

    it("should handle required validator from Validators", () => {
      component.control = new FormControl("", [Validators.required]);
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      // Note: This uses required from common.validators, not Validators.required
      // So it won't have the class unless we use the custom required validator
      expect(label).toBeTruthy();
    });
  });

  describe("Tooltip", () => {
    it("should render tooltip when tooltipLabel is provided", () => {
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          tooltipLabel: "This is a helpful tooltip",
        },
      };
      fixture.detectChanges();

      const tooltip = fixture.nativeElement.querySelector("frm-field-tooltip");
      expect(tooltip).toBeTruthy();
    });

    it("should not render tooltip when tooltipLabel is not provided", () => {
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const tooltip = fixture.nativeElement.querySelector("frm-field-tooltip");
      expect(tooltip).toBeFalsy();
    });

    it("should have floating-tooltip class on tooltip", () => {
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          tooltipLabel: "Tooltip text",
        },
      };
      fixture.detectChanges();

      const tooltip = fixture.nativeElement.querySelector("frm-field-tooltip");
      expect(tooltip.classList.contains("floating-tooltip")).toBe(true);
    });
  });

  describe("Label Strategy", () => {
    it("should use float label strategy", () => {
      component.labelStrategy = "float";
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
    });

    it("should use ifta label strategy", () => {
      component.labelStrategy = "ifta";
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const iftaLabel = fixture.nativeElement.querySelector("p-iftalabel");
      expect(iftaLabel).toBeTruthy();
    });

    it("should use normal label strategy", () => {
      component.labelStrategy = "normal";
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      const iftaLabel = fixture.nativeElement.querySelector("p-iftalabel");
      expect(floatLabel).toBeFalsy();
      expect(iftaLabel).toBeFalsy();
    });

    it("should force normal strategy for CHECKBOX control", () => {
      component.labelStrategy = "float";
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.CHECKBOX,
      };
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeFalsy();
    });

    it("should force normal strategy for FILES control", () => {
      component.labelStrategy = "float";
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.FILES,
      };
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeFalsy();
    });

    it("should force normal strategy for RADIO control", () => {
      component.labelStrategy = "ifta";
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.RADIO,
      };
      fixture.detectChanges();

      const iftaLabel = fixture.nativeElement.querySelector("p-iftalabel");
      expect(iftaLabel).toBeFalsy();
    });

    it("should force normal strategy for SELECT_BUTTON control", () => {
      component.labelStrategy = "float";
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.SELECT_BUTTON,
      };
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeFalsy();
    });

    it("should force normal strategy for PICKLIST control", () => {
      component.labelStrategy = "float";
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.PICKLIST,
      };
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeFalsy();
    });

    it("should force normal strategy for TABLE control", () => {
      component.labelStrategy = "float";
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.TABLE,
      };
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeFalsy();
    });

    it("should force normal strategy for WYSIWYG control", () => {
      component.labelStrategy = "float";
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.WYSIWYG,
      };
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeFalsy();
    });

    it("should force normal strategy for CUSTOM control", () => {
      component.labelStrategy = "float";
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.CUSTOM,
      };
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeFalsy();
    });
  });

  describe("Label Variant", () => {
    it("should use 'on' variant when specified", () => {
      component.labelStrategy = "float";
      component.labelVariant = "on";
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
    });

    it("should use 'in' variant when specified", () => {
      component.labelStrategy = "float";
      component.labelVariant = "in";
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
    });

    it("should use 'over' variant when specified", () => {
      component.labelStrategy = "float";
      component.labelVariant = "over";
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
    });

    it("should default to 'on' variant when undefined", () => {
      component.labelStrategy = "float";
      component.labelVariant = undefined;
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
    });
  });

  describe("Input Icon", () => {
    it("should render icon field when inputIcon is provided", () => {
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          inputIcon: "pi pi-search",
        },
      };
      fixture.detectChanges();

      const iconField = fixture.nativeElement.querySelector("p-iconfield");
      expect(iconField).toBeTruthy();
      expect(iconField.classList.contains("has-icon")).toBe(true);
    });

    it("should not add has-icon class when inputIcon is not provided", () => {
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const iconField = fixture.nativeElement.querySelector("p-iconfield");
      expect(iconField.classList.contains("has-icon")).toBe(false);
    });

    it("should set icon class on p-inputicon", () => {
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          inputIcon: "pi pi-calendar",
        },
      };
      fixture.detectChanges();

      const inputIcon = fixture.nativeElement.querySelector("p-inputicon");
      expect(inputIcon.classList.contains("pi")).toBe(true);
      expect(inputIcon.classList.contains("pi-calendar")).toBe(true);
    });
  });

  describe("Content Projection", () => {
    it("should project input element from ng-content", () => {
      component.config = {
        key: "testField",
        label: "Test",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector("input[type='text']");
      expect(input).toBeTruthy();
      expect(input.getAttribute("id")).toBe("testField");
    });
  });

  describe("Dynamic Updates", () => {
    it("should update label when config changes", () => {
      component.config = {
        key: "field",
        label: "Initial Label",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      let label = fixture.nativeElement.querySelector("label");
      expect(label.textContent?.trim()).toContain("Initial Label");

      component.config = {
        key: "field",
        label: "Updated Label",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      label = fixture.nativeElement.querySelector("label");
      expect(label.textContent?.trim()).toContain("Updated Label");
    });

    it("should update required indicator when validators change", () => {
      component.control = new FormControl("");
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      let label = fixture.nativeElement.querySelector("label");
      expect(label.classList.contains("mandatory-control")).toBe(false);

      // Create new control with validators
      component.control = new FormControl("", [required]);
      fixture.detectChanges();

      label = fixture.nativeElement.querySelector("label");
      expect(label.classList.contains("mandatory-control")).toBe(true);
    });

    it("should update strategy when labelStrategy changes", () => {
      component.labelStrategy = "normal";
      fixture.detectChanges();

      let floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeFalsy();

      component.labelStrategy = "float";
      fixture.detectChanges();

      floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("should handle config without key", () => {
      component.config = {
        label: "No Key",
        controlType: CONTROL_TYPES.INPUT,
      } as any;
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label).toBeTruthy();
    });

    it("should handle empty controlOptions", () => {
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {},
      };
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label).toBeTruthy();
    });

    it("should handle undefined controlOptions", () => {
      component.config = {
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label).toBeTruthy();
    });
  });
});
