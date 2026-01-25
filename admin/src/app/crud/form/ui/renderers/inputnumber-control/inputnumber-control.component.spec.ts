import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { INPUT_TYPES } from "@crud/core/models/input-type.model";
import { InputNumberControlComponent } from "./inputnumber-control.component";

describe("InputNumberControlComponent", () => {
  let component: InputNumberControlComponent;
  let fixture: ComponentFixture<InputNumberControlComponent>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "testNumber",
    label: "Test Number",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.NUMBER,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputNumberControlComponent, ReactiveFormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(InputNumberControlComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("config", createDefaultConfig());
    fixture.componentRef.setInput("control", new FormControl(0));
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
    it("should render p-inputnumber element", () => {
      fixture.detectChanges();
      const inputNumber = fixture.nativeElement.querySelector("p-inputnumber");
      expect(inputNumber).toBeTruthy();
    });
  });

  /**
   * ========================================
   * SECTION 3: INPUT BINDING & CONFIGURATION
   * ========================================
   */
  describe("Input Binding & Configuration", () => {
    it("should bind formControl to the component control", () => {
      const testControl = new FormControl(42);
      fixture.componentRef.setInput("control", testControl);
      fixture.detectChanges();

      expect(component.control()).toBe(testControl);
      expect(component.control().value).toBe(42);
    });

    it("should display placeholder from config", () => {
      const config = createDefaultConfig();
      config.controlOptions = { placeholder: "Enter number..." };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.placeholder()).toBe("Enter number...");
    });

    it("should handle empty placeholder", () => {
      fixture.detectChanges();
      expect(component.placeholder()).toBe("");
    });

    it("should set min value from config", () => {
      const config = createDefaultConfig();
      config.controlOptions = { min: 0 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().min).toBe(0);
    });

    it("should set max value from config", () => {
      const config = createDefaultConfig();
      config.controlOptions = { max: 100 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().max).toBe(100);
    });

    it("should set step value from config", () => {
      const config = createDefaultConfig();
      config.controlOptions = { step: 5 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().step).toBe(5);
    });
  });

  /**
   * ========================================
   * SECTION 4: USER INTERACTIONS & EVENTS
   * ========================================
   */
  describe("User Interactions & Events", () => {
    it("should emit fieldInteraction on input", (done) => {
      fixture.detectChanges();

      component.fieldInteraction.subscribe(
        (event: FormFieldInteractionEvent) => {
          expect(event.interactionType).toBe("keyup");
          expect(event.key).toBe("testNumber");
          done();
        },
      );

      component.emitInteractionEvent("keyup");
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
   * SECTION 5: INPUTNUMBER-SPECIFIC FEATURES
   * ========================================
   */
  describe("InputNumber-Specific Features", () => {
    it("should handle integer values", () => {
      const control = new FormControl(123);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(123);
    });

    it("should handle decimal values", () => {
      const control = new FormControl(123.45);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(123.45);
    });

    it("should handle negative values", () => {
      const control = new FormControl(-50);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(-50);
    });

    it("should handle zero value", () => {
      const control = new FormControl(0);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(0);
    });

    it("should respect min constraint", () => {
      const config = createDefaultConfig();
      config.controlOptions = { min: 10 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().min).toBe(10);
    });

    it("should respect max constraint", () => {
      const config = createDefaultConfig();
      config.controlOptions = { max: 100 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().max).toBe(100);
    });

    it("should increment by step value", () => {
      const config = createDefaultConfig();
      config.controlOptions = { step: 10 };
      const control = new FormControl(0);
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      control.setValue(10);
      expect(control.value).toBe(10);
    });

    it("should handle decimal places configuration", () => {
      const config = createDefaultConfig();
      config.controlOptions = { minFractionDigits: 2, maxFractionDigits: 2 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().minFractionDigits).toBe(2);
      expect(component.options().maxFractionDigits).toBe(2);
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
      const disabledControl = new FormControl({ value: 0, disabled: true });
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
    it("should render with PrimeNG InputNumber component", () => {
      fixture.detectChanges();
      const inputNumber = fixture.nativeElement.querySelector("p-inputnumber");
      expect(inputNumber).toBeTruthy();
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

    it("should handle undefined value", () => {
      const control = new FormControl(undefined);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      // InputNumber control converts undefined to null
      expect(control.value).toBeNull();
    });

    it("should handle very large numbers", () => {
      const control = new FormControl(9999999999);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(9999999999);
    });

    it("should handle very small decimal numbers", () => {
      const control = new FormControl(0.0001);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(0.0001);
    });

    it("should handle negative min and max", () => {
      const config = createDefaultConfig();
      config.controlOptions = { min: -100, max: -10 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().min).toBe(-100);
      expect(component.options().max).toBe(-10);
    });
  });
});
