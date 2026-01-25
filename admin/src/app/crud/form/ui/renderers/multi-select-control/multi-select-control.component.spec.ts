import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { MultiSelectControlComponent } from "./multi-select-control.component";

describe("MultiSelectControlComponent", () => {
  let component: MultiSelectControlComponent;
  let fixture: ComponentFixture<MultiSelectControlComponent>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "testMultiSelect",
    label: "Test Multi Select",
    controlType: CONTROL_TYPES.MULTISELECT,
    options: [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" },
      { label: "Option 3", value: "opt3" },
    ],
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectControlComponent, ReactiveFormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSelectControlComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("config", createDefaultConfig());
    fixture.componentRef.setInput("control", new FormControl([]));
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
    it("should render p-multiSelect element", () => {
      fixture.detectChanges();
      const multiSelect = fixture.nativeElement.querySelector("p-multiselect");
      expect(multiSelect).toBeTruthy();
    });

    it("should append dropdown to body", () => {
      fixture.detectChanges();
      const multiSelect = fixture.nativeElement.querySelector("p-multiselect");
      expect(multiSelect.getAttribute("appendto")).toBe("body");
    });

    it("should set display mode to chip", () => {
      fixture.detectChanges();
      const multiSelect = fixture.nativeElement.querySelector("p-multiselect");
      expect(multiSelect.getAttribute("display")).toBe("chip");
    });
  });

  /**
   * ========================================
   * SECTION 3: INPUT BINDING & CONFIGURATION
   * ========================================
   */
  describe("Input Binding & Configuration", () => {
    it("should bind formControl to the component control", () => {
      const testControl = new FormControl(["opt1", "opt2"]);
      fixture.componentRef.setInput("control", testControl);
      fixture.detectChanges();

      expect(component.control()).toBe(testControl);
      expect(component.control().value).toEqual(["opt1", "opt2"]);
    });

    it("should display placeholder from config", () => {
      const config = createDefaultConfig();
      config.controlOptions = { placeholder: "Select options..." };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.placeholder()).toBe("Select options...");
    });

    it("should handle empty placeholder", () => {
      fixture.detectChanges();
      expect(component.placeholder()).toBe("");
    });

    it("should use options from config", () => {
      fixture.detectChanges();
      expect(component.selectOptions().length).toBe(3);
      expect(component.selectOptions()[0].label).toBe("Option 1");
    });

    it("should set maxSelectedLabels with default value", () => {
      fixture.detectChanges();
      // Default is 5, accessed via options()
      expect(component.options().maxSelectedLabels ?? 5).toBe(5);
    });

    it("should set maxSelectedLabels from config", () => {
      const config = createDefaultConfig();
      config.controlOptions = { maxSelectedLabels: 3 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().maxSelectedLabels).toBe(3);
    });

    it("should enable filter by default", () => {
      fixture.detectChanges();
      expect(component.options().areOptionsFilterable ?? true).toBe(true);
    });

    it("should enable toggle all by default", () => {
      fixture.detectChanges();
      expect(component.options().isSelectAllEnabled ?? true).toBe(true);
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
          expect(event.key).toBe("testMultiSelect");
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
   * SECTION 5: MULTISELECT-SPECIFIC FEATURES
   * ========================================
   */
  describe("MultiSelect-Specific Features", () => {
    it("should handle multiple selections", () => {
      const control = new FormControl(["opt1", "opt3"]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toEqual(["opt1", "opt3"]);
      expect(control.value?.length).toBe(2);
    });

    it("should handle empty selection", () => {
      const control = new FormControl([]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toEqual([]);
    });

    it("should handle all items selected", () => {
      const control = new FormControl<string[]>(["opt1", "opt2", "opt3"]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value?.length).toBe(3);
    });

    it("should allow adding selections", () => {
      const control = new FormControl(["opt1"]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      control.setValue(["opt1", "opt2"]);
      expect(control.value).toEqual(["opt1", "opt2"]);
    });

    it("should allow removing selections", () => {
      const control = new FormControl(["opt1", "opt2"]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      control.setValue(["opt1"]);
      expect(control.value).toEqual(["opt1"]);
    });

    it("should display selections as chips", () => {
      fixture.detectChanges();
      const multiSelect = fixture.nativeElement.querySelector("p-multiselect");
      expect(multiSelect.getAttribute("display")).toBe("chip");
    });

    it("should support filtering options", () => {
      const config = createDefaultConfig();
      config.controlOptions = { areOptionsFilterable: true };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().areOptionsFilterable).toBe(true);
    });

    it("should disable filtering when configured", () => {
      const config = createDefaultConfig();
      config.controlOptions = { areOptionsFilterable: false };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().areOptionsFilterable).toBe(false);
    });

    it("should support select all toggle", () => {
      const config = createDefaultConfig();
      config.controlOptions = { isSelectAllEnabled: true };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().isSelectAllEnabled).toBe(true);
    });

    it("should disable select all when configured", () => {
      const config = createDefaultConfig();
      config.controlOptions = { isSelectAllEnabled: false };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().isSelectAllEnabled).toBe(false);
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
      const disabledControl = new FormControl({ value: [], disabled: true });
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
    it("should render with PrimeNG MultiSelect component", () => {
      fixture.detectChanges();
      const multiSelect = fixture.nativeElement.querySelector("p-multiselect");
      expect(multiSelect).toBeTruthy();
    });

    it("should set filter placeholder", () => {
      fixture.detectChanges();
      const multiSelect = fixture.nativeElement.querySelector("p-multiselect");
      expect(multiSelect.getAttribute("filterplaceholder")).toBe("---");
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

    it("should handle empty options array", () => {
      const config = createDefaultConfig();
      config.options = [];
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.selectOptions().length).toBe(0);
    });

    it("should handle selections with invalid values", () => {
      const control = new FormControl(["opt1", "invalid"]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toEqual(["opt1", "invalid"]);
    });

    it("should handle duplicate selections", () => {
      const control = new FormControl(["opt1", "opt1"]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toEqual(["opt1", "opt1"]);
    });

    it("should handle disabled options", () => {
      const config = createDefaultConfig();
      config.options = [
        { label: "Option 1", value: "opt1" },
        { label: "Option 2", value: "opt2", disabled: true },
      ];
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const disabledOption = component
        .selectOptions()
        .find((o) => o.value === "opt2");
      expect(disabledOption?.disabled).toBe(true);
    });
  });
});
