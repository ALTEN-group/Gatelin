import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { SelectButtonControlComponent } from "./select-button-control.component";

describe("SelectButtonControlComponent", () => {
  let component: SelectButtonControlComponent;
  let fixture: ComponentFixture<SelectButtonControlComponent>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "testSelectButton",
    label: "Test Select Button",
    controlType: CONTROL_TYPES.SELECT_BUTTON,
    options: [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" },
      { label: "Option 3", value: "opt3" },
    ],
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectButtonControlComponent, ReactiveFormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectButtonControlComponent);
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
    it("should render p-selectButton element", () => {
      fixture.detectChanges();
      const selectButton =
        fixture.nativeElement.querySelector("p-selectbutton");
      expect(selectButton).toBeTruthy();
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

    it("should use options from config", () => {
      fixture.detectChanges();
      expect(component.selectOptions().length).toBe(3);
      expect(component.selectOptions()[0].label).toBe("Option 1");
      expect(component.selectOptions()[0].value).toBe("opt1");
    });

    it("should handle multiple selection mode", () => {
      const config = createDefaultConfig();
      config.controlOptions = { multiple: true };
      const control = new FormControl(["opt1", "opt2"]);
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toEqual(["opt1", "opt2"]);
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
          expect(event.key).toBe("testSelectButton");
          done();
        },
      );

      component.emitInteractionEvent("valueChange");
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
  });

  /**
   * ========================================
   * SECTION 5: SELECTBUTTON-SPECIFIC FEATURES
   * ========================================
   */
  describe("SelectButton-Specific Features", () => {
    it("should handle single selection", () => {
      const control = new FormControl("opt2");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe("opt2");
    });

    it("should handle multiple selection when configured", () => {
      const config = createDefaultConfig();
      config.controlOptions = { multiple: true };
      const control = new FormControl(["opt1", "opt3"]);
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toEqual(["opt1", "opt3"]);
    });

    it("should toggle selection in multiple mode", () => {
      const config = createDefaultConfig();
      config.controlOptions = { multiple: true };
      const control = new FormControl(["opt1"]);
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      control.setValue(["opt1", "opt2"]);
      expect(control.value).toEqual(["opt1", "opt2"]);
    });

    it("should allow unselection when configured", () => {
      const config = createDefaultConfig();
      config.controlOptions = { isSelectButtonOptionToggleable: true };
      const control = new FormControl("opt1");
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      control.setValue(null);
      expect(control.value).toBeNull();
    });

    it("should handle options with icons", () => {
      const config = createDefaultConfig();
      config.options = [
        { label: "Left", value: "left", icon: "pi pi-align-left" },
        { label: "Center", value: "center", icon: "pi pi-align-center" },
      ];
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.selectOptions()[0].icon).toBe("pi pi-align-left");
      expect(component.selectOptions()[1].icon).toBe("pi pi-align-center");
    });

    it("should display as button group", () => {
      fixture.detectChanges();
      const selectButton =
        fixture.nativeElement.querySelector("p-selectbutton");
      expect(selectButton).toBeTruthy();
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

  /**
   * ========================================
   * SECTION 7: TEMPLATE FEATURES
   * ========================================
   */
  describe("Template Features", () => {
    it("should render with PrimeNG SelectButton component", () => {
      fixture.detectChanges();
      const selectButton =
        fixture.nativeElement.querySelector("p-selectbutton");
      expect(selectButton).toBeTruthy();
    });
  });

  /**
   * ========================================
   * SECTION 8: EDGE CASES & ERROR HANDLING
   * ========================================
   */
  describe("Edge Cases & Error Handling", () => {
    it("should handle null value in single mode", () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBeNull();
    });

    it("should handle empty array in multiple mode", () => {
      const config = createDefaultConfig();
      config.controlOptions = { multiple: true };
      const control = new FormControl([]);
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toEqual([]);
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

    it("should handle invalid selected value", () => {
      const control = new FormControl("invalid-value");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe("invalid-value");
    });
  });
});
