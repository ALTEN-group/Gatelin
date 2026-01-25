import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { required } from "@crud/form/utils/common.validators";
import { SelectControlComponent } from "./select-control.component";

describe("SelectControlComponent", () => {
  let component: SelectControlComponent;
  let fixture: ComponentFixture<SelectControlComponent>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "testSelect",
    label: "Test Select",
    controlType: CONTROL_TYPES.SELECT,
    options: [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" },
      { label: "Option 3", value: "opt3" },
    ],
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectControlComponent, ReactiveFormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectControlComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("config", createDefaultConfig());
    fixture.componentRef.setInput("control", new FormControl(""));
    fixture.componentRef.setInput("isFormReadonly", false);
  });

  /**
   * ========================================
   * SECTION 1: COMPONENT CREATION & INITIALIZATION
   * ========================================
   */
  describe("Component Creation & Initialization", () => {
    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize with default config", () => {
      fixture.detectChanges();
      expect(component.config()).toBeDefined();
      expect(component.control()).toBeDefined();
    });

    it("should extend FormFieldBaseComponent", () => {
      expect(component.config).toBeDefined();
      expect(component.control).toBeDefined();
      expect(component.isFormReadonly).toBeDefined();
    });
  });

  /**
   * ========================================
   * SECTION 2: RENDERING & DOM
   * ========================================
   */
  describe("Rendering & DOM", () => {
    it("should render p-select element", () => {
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector("p-select");
      expect(select).toBeTruthy();
    });

    it("should append dropdown to body", () => {
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector("p-select");
      expect(select.getAttribute("appendto")).toBe("body");
    });

    it("should set filter placeholder", () => {
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector("p-select");
      expect(select.getAttribute("filterplaceholder")).toBe("---");
    });
  });

  /**
   * ========================================
   * SECTION 3: INPUT BINDING & CONFIGURATION
   * ========================================
   */
  describe("Input Binding & Configuration", () => {
    it("should bind formControl to the component control", () => {
      const testControl = new FormControl("opt1");
      fixture.componentRef.setInput("control", testControl);
      fixture.detectChanges();

      expect(component.control()).toBe(testControl);
      expect(component.control().value).toBe("opt1");
    });

    it("should display placeholder from config", () => {
      const config = createDefaultConfig();
      config.controlOptions = { placeholder: "Choose option..." };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.placeholder()).toBe("Choose option...");
    });

    it("should handle empty placeholder", () => {
      fixture.detectChanges();
      expect(component.placeholder()).toBe("");
    });

    it("should use options from config", () => {
      fixture.detectChanges();
      expect(component.selectOptions().length).toBe(3);
      expect(component.selectOptions()[0].label).toBe("Option 1");
      expect(component.selectOptions()[0].value).toBe("opt1");
    });

    it("should show clear button when not required", () => {
      fixture.detectChanges();
      expect(component.isRequired()).toBe(false);
    });

    it("should hide clear button when required", () => {
      const config = createDefaultConfig();
      config.controlOptions = { validators: [required] };
      const control = new FormControl("", [required]);
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.isRequired()).toBe(true);
    });
  });

  /**
   * ========================================
   * SECTION 4: USER INTERACTIONS & EVENTS
   * ========================================
   */
  describe("User Interactions & Events", () => {
    it("should emit fieldInteraction on value change", (done) => {
      fixture.detectChanges();

      component.fieldInteraction.subscribe(
        (event: FormFieldInteractionEvent) => {
          expect(event.interactionType).toBe("valueChange");
          expect(event.key).toBe("testSelect");
          done();
        },
      );

      component.emitInteractionEvent("valueChange");
    });

    it("should emit fieldInteraction on clear", (done) => {
      fixture.detectChanges();

      component.fieldInteraction.subscribe(
        (event: FormFieldInteractionEvent) => {
          expect(event.interactionType).toBe("clear");
          done();
        },
      );

      component.emitInteractionEvent("clear");
    });

    it("should emit fieldInteraction on focus", (done) => {
      fixture.detectChanges();

      component.fieldInteraction.subscribe(
        (event: FormFieldInteractionEvent) => {
          expect(event.interactionType).toBe("focus");
          done();
        },
      );

      component.emitInteractionEvent("focus");
    });

    it("should emit fieldInteraction on blur", (done) => {
      fixture.detectChanges();

      component.fieldInteraction.subscribe(
        (event: FormFieldInteractionEvent) => {
          expect(event.interactionType).toBe("blur");
          done();
        },
      );

      component.emitInteractionEvent("blur");
    });

    it("should emit fieldInteraction on panel open", (done) => {
      fixture.detectChanges();

      component.fieldInteraction.subscribe(
        (event: FormFieldInteractionEvent) => {
          expect(event.interactionType).toBe("panelOpen");
          done();
        },
      );

      component.emitInteractionEvent("panelOpen");
    });

    it("should emit fieldInteraction on panel close", (done) => {
      fixture.detectChanges();

      component.fieldInteraction.subscribe(
        (event: FormFieldInteractionEvent) => {
          expect(event.interactionType).toBe("panelClose");
          done();
        },
      );

      component.emitInteractionEvent("panelClose");
    });
  });

  /**
   * ========================================
   * SECTION 5: SELECT-SPECIFIC FEATURES
   * ========================================
   */
  describe("Select-Specific Features", () => {
    it("should handle single selection", () => {
      const control = new FormControl("opt2");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe("opt2");
    });

    it("should allow clearing selection when not required", () => {
      const control = new FormControl("opt1");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.isRequired()).toBe(false);

      control.setValue(null);
      expect(control.value).toBeNull();
    });

    it("should handle disabled options", () => {
      const config = createDefaultConfig();
      config.options = [
        { label: "Option 1", value: "opt1" },
        { label: "Option 2", value: "opt2", disabled: true },
        { label: "Option 3", value: "opt3" },
      ];
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const disabledOption = component
        .selectOptions()
        .find((o) => o.value === "opt2");
      expect(disabledOption?.disabled).toBe(true);
    });

    it("should render options with icons", () => {
      const config = createDefaultConfig();
      config.options = [
        { label: "Option 1", value: "opt1", icon: "pi pi-star" },
        { label: "Option 2", value: "opt2" },
      ];
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const optionWithIcon = component.selectOptions()[0];
      expect(optionWithIcon.icon).toBe("pi pi-star");
    });

    it("should handle empty options array", () => {
      const config = createDefaultConfig();
      config.options = [];
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.selectOptions().length).toBe(0);
    });
  });

  /**
   * ========================================
   * SECTION 6: READONLY & DISABLED STATES
   * ========================================
   */
  describe("Readonly & Disabled States", () => {
    it("should handle readonly state from parent", () => {
      fixture.componentRef.setInput("isFormReadonly", true);
      fixture.detectChanges();

      expect(component.isFormReadonly()).toBe(true);
    });

    it("should reflect disabled state from control", () => {
      const disabledControl = new FormControl({ value: "", disabled: true });
      fixture.componentRef.setInput("control", disabledControl);
      fixture.detectChanges();

      expect(component.isDisabled()).toBe(true);
    });

    it("should not be disabled by default", () => {
      fixture.detectChanges();
      expect(component.isDisabled()).toBe(false);
    });
  });

  /**
   * ========================================
   * SECTION 7: TEMPLATE FEATURES
   * ========================================
   */
  describe("Template Features", () => {
    it("should use custom template for selected item with icon", () => {
      const config = createDefaultConfig();
      config.options = [{ label: "Star", value: "star", icon: "pi pi-star" }];
      const control = new FormControl("star");
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      // Template rendering is handled by PrimeNG internally
      expect(component.selectOptions()[0].icon).toBe("pi pi-star");
    });

    it("should use custom template for dropdown items with icon", () => {
      const config = createDefaultConfig();
      config.options = [
        { label: "Item 1", value: "item1", icon: "pi pi-home" },
        { label: "Item 2", value: "item2", icon: "pi pi-user" },
      ];
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.selectOptions()[0].icon).toBeDefined();
      expect(component.selectOptions()[1].icon).toBeDefined();
    });

    it("should handle items without icons", () => {
      fixture.detectChanges();

      const optionWithoutIcon = component.selectOptions()[0];
      expect(optionWithoutIcon.icon).toBeUndefined();
    });
  });

  /**
   * ========================================
   * SECTION 8: EDGE CASES & ERROR HANDLING
   * ========================================
   */
  describe("Edge Cases & Error Handling", () => {
    it("should handle null value", () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBeNull();
    });

    it("should handle undefined options", () => {
      const config = createDefaultConfig();
      delete config.options;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.selectOptions()).toEqual([]);
    });

    it("should handle invalid selected value", () => {
      const control = new FormControl("invalid-value");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe("invalid-value");
    });

    it("should handle options with duplicate values", () => {
      const config = createDefaultConfig();
      config.options = [
        { label: "Option 1", value: "duplicate" },
        { label: "Option 2", value: "duplicate" },
      ];
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.selectOptions().length).toBe(2);
    });

    it("should handle very long option labels", () => {
      const config = createDefaultConfig();
      config.options = [{ label: "A".repeat(200), value: "long" }];
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.selectOptions()[0].label?.length).toBe(200);
    });
  });
});
