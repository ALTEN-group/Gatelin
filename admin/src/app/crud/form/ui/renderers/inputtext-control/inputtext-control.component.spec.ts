import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { InputTextControlComponent } from "./inputtext-control.component";

describe("InputTextControlComponent", () => {
  let component: InputTextControlComponent;
  let fixture: ComponentFixture<InputTextControlComponent>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "testInput",
    label: "Test Input",
    controlType: CONTROL_TYPES.INPUT,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextControlComponent, ReactiveFormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTextControlComponent);
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
    it("should render input element with pInputText directive", () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector("input[pInputText]");
      expect(input).toBeTruthy();
    });

    it("should set type attribute to text", () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector("input");
      expect(input.getAttribute("type")).toBe("text");
    });
  });

  /**
   * ========================================
   * SECTION 3: INPUT BINDING & CONFIGURATION
   * ========================================
   */
  describe("Input Binding & Configuration", () => {
    it("should bind formControl to the component control", () => {
      const testControl = new FormControl("test value");
      fixture.componentRef.setInput("control", testControl);
      fixture.detectChanges();

      expect(component.control()).toBe(testControl);
      expect(component.control().value).toBe("test value");
    });

    it("should display placeholder from config", () => {
      const config = createDefaultConfig();
      config.controlOptions = { placeholder: "Enter text..." };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.placeholder()).toBe("Enter text...");
    });

    it("should handle empty placeholder", () => {
      fixture.detectChanges();
      expect(component.placeholder()).toBe("");
    });

    it("should set maxLength from config", () => {
      const config = createDefaultConfig();
      config.controlOptions = { maxLength: 100 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.maxLength()).toBe(100);
    });

    it("should set minLength from config", () => {
      const config = createDefaultConfig();
      config.controlOptions = { minLength: 5 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.minLength()).toBe(5);
    });

    it("should return null when no maxLength is configured", () => {
      fixture.detectChanges();
      expect(component.maxLength()).toBeNull();
    });

    it("should return null when no minLength is configured", () => {
      fixture.detectChanges();
      expect(component.minLength()).toBeNull();
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
          expect(event.key).toBe("testInput");
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
   * SECTION 5: INPUTTEXT-SPECIFIC FEATURES
   * ========================================
   */
  describe("InputText-Specific Features", () => {
    it("should enforce maxLength constraint", () => {
      const config = createDefaultConfig();
      config.controlOptions = { maxLength: 10 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector("input");
      expect(input.getAttribute("maxlength")).toBe("10");
    });

    it("should enforce minLength constraint", () => {
      const config = createDefaultConfig();
      config.controlOptions = { minLength: 3 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector("input");
      expect(input.getAttribute("minlength")).toBe("3");
    });

    it("should not set maxlength attribute when null", () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector("input");
      expect(input.getAttribute("maxlength")).toBeNull();
    });

    it("should not set minlength attribute when null", () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector("input");
      expect(input.getAttribute("minlength")).toBeNull();
    });

    it("should handle both minLength and maxLength together", () => {
      const config = createDefaultConfig();
      config.controlOptions = { minLength: 5, maxLength: 20 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.minLength()).toBe(5);
      expect(component.maxLength()).toBe(20);
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
    it("should apply pInputText directive styling", () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector("input[pInputText]");
      expect(input).toBeTruthy();
    });
  });

  /**
   * ========================================
   * SECTION 8: EDGE CASES & ERROR HANDLING
   * ========================================
   */
  describe("Edge Cases & Error Handling", () => {
    it("should handle empty string value", () => {
      const control = new FormControl("");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe("");
    });

    it("should handle null value", () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBeNull();
    });

    it("should handle very long text", () => {
      const longText = "a".repeat(1000);
      const control = new FormControl(longText);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(longText);
    });

    it("should handle special characters", () => {
      const specialText = "<script>alert('test')</script>";
      const control = new FormControl(specialText);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(specialText);
    });

    it("should handle unicode characters", () => {
      const unicodeText = "Hello 世界 🌍";
      const control = new FormControl(unicodeText);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(unicodeText);
    });

    it("should handle maxLength of 0", () => {
      const config = createDefaultConfig();
      config.controlOptions = { maxLength: 0 };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.maxLength()).toBeNull();
    });
  });
});
