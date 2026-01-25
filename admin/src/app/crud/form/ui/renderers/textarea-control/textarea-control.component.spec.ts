import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { TextareaControlComponent } from "./textarea-control.component";

describe("TextareaControlComponent", () => {
  let component: TextareaControlComponent;
  let fixture: ComponentFixture<TextareaControlComponent>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "testTextarea",
    label: "Test Textarea",
    controlType: CONTROL_TYPES.TEXTAREA,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaControlComponent, ReactiveFormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaControlComponent);
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
    it("should render textarea element", () => {
      fixture.detectChanges();
      const textarea = fixture.nativeElement.querySelector("textarea");
      expect(textarea).toBeTruthy();
    });

    it("should have p-textarea directive", () => {
      fixture.detectChanges();
      const textarea = fixture.nativeElement.querySelector(
        "textarea[pTextarea]",
      );
      expect(textarea).toBeTruthy();
    });
  });

  /**
   * ========================================
   * SECTION 3: INPUT BINDING & CONFIGURATION
   * ========================================
   */
  describe("Input Binding & Configuration", () => {
    it("should bind formControl to the component control", () => {
      const testControl = new FormControl("test content");
      fixture.componentRef.setInput("control", testControl);
      fixture.detectChanges();

      expect(component.control()).toBe(testControl);
      expect(component.control().value).toBe("test content");
    });

    it("should display placeholder from config", () => {
      const config = createDefaultConfig();
      config.controlOptions = { placeholder: "Enter description..." };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.placeholder()).toBe("Enter description...");
    });

    it("should handle empty placeholder", () => {
      fixture.detectChanges();
      expect(component.placeholder()).toBe("");
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
          expect(event.key).toBe("testTextarea");
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
   * SECTION 5: TEXTAREA-SPECIFIC FEATURES
   * ========================================
   */
  describe("Textarea-Specific Features", () => {
    it("should handle multi-line text", () => {
      const multiLineText = "Line 1\nLine 2\nLine 3";
      const control = new FormControl(multiLineText);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(multiLineText);
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
    it("should apply p-textarea directive styling", () => {
      fixture.detectChanges();
      const textarea = fixture.nativeElement.querySelector(
        "textarea[pTextarea]",
      );
      expect(textarea).toBeTruthy();
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
      const longText = "A".repeat(10000);
      const control = new FormControl(longText);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(longText);
    });

    it("should handle text with special characters", () => {
      const specialText = "<script>alert('xss')</script>\n\t\r\"'";
      const control = new FormControl(specialText);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(specialText);
    });

    it("should handle unicode and emoji", () => {
      const unicodeText = "Hello 世界 🌍\n😀 emoji test";
      const control = new FormControl(unicodeText);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(unicodeText);
    });

    it("should handle text with tabs and newlines", () => {
      const textWithWhitespace = "\t\tIndented\n\nDouble newline";
      const control = new FormControl(textWithWhitespace);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(textWithWhitespace);
    });
  });
});
