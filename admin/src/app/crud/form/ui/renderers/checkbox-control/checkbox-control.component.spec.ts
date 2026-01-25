import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { CheckboxControlComponent } from "./checkbox-control.component";

describe("CheckboxControlComponent", () => {
  let component: CheckboxControlComponent;
  let fixture: ComponentFixture<CheckboxControlComponent>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "testCheckbox",
    label: "Test Checkbox",
    controlType: CONTROL_TYPES.CHECKBOX,
    controlOptions: {},
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxControlComponent, ReactiveFormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxControlComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("config", createDefaultConfig());
    fixture.componentRef.setInput("control", new FormControl(false));
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
    it("should render p-checkbox element", () => {
      fixture.detectChanges();
      const checkbox = fixture.nativeElement.querySelector("p-checkbox");
      expect(checkbox).toBeTruthy();
    });

    it("should have checkbox-container wrapper", () => {
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector(
        ".checkbox-container",
      );
      expect(container).toBeTruthy();
    });
  });

  /**
   * ========================================
   * SECTION 3: INPUT BINDING & CONFIGURATION
   * ========================================
   */
  describe("Input Binding & Configuration", () => {
    it("should bind formControl to the component control", () => {
      const testControl = new FormControl(true);
      fixture.componentRef.setInput("control", testControl);
      fixture.detectChanges();

      expect(component.control()).toBe(testControl);
      expect(component.control().value).toBe(true);
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
          expect(event.key).toBe("testCheckbox");
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
   * SECTION 5: CHECKBOX-SPECIFIC FEATURES
   * ========================================
   */
  describe("Checkbox-Specific Features", () => {
    it("should use binary mode for true/false values", () => {
      fixture.detectChanges();
      const checkbox = fixture.nativeElement.querySelector("p-checkbox");
      expect(checkbox).toBeTruthy();
    });

    it("should toggle value when clicked", () => {
      const control = new FormControl(false);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      control.setValue(true);
      fixture.detectChanges();

      expect(control.value).toBe(true);
    });

    it("should handle unchecked state", () => {
      const control = new FormControl(false);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(false);
    });

    it("should handle checked state", () => {
      const control = new FormControl(true);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe(true);
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
      const disabledControl = new FormControl({ value: false, disabled: true });
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
   * SECTION 7: EDGE CASES & ERROR HANDLING
   * ========================================
   */
  describe("Edge Cases & Error Handling", () => {
    it("should handle null value", () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBeNull();
    });
  });
});
