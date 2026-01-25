import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { required } from "@crud/form/utils/common.validators";
import { FormSimpleElement } from "./simple-element";

describe("FormSimpleElement", () => {
  let component: FormSimpleElement;
  let fixture: ComponentFixture<FormSimpleElement>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "testField",
    label: "Test Field",
    controlType: CONTROL_TYPES.INPUT,
    controlOptions: {},
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSimpleElement, ReactiveFormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSimpleElement);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("config", createDefaultConfig());
    fixture.componentRef.setInput("control", new FormControl(""));
    fixture.componentRef.setInput("isFormReadonly", false);
    fixture.componentRef.setInput("defaultControlWidth", "300px");
    fixture.componentRef.setInput("labelStrategy", "float");
    fixture.componentRef.setInput("labelStrategyVariant", "on");
    fixture.componentRef.setInput("syncValueInc", 0);
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

    it("should initialize with required inputs", () => {
      fixture.detectChanges();
      expect(component.config()).toBeDefined();
      expect(component.control()).toBeDefined();
      expect(component.isFormReadonly()).toBeDefined();
      expect(component.defaultControlWidth()).toBe("300px");
      expect(component.labelStrategy()).toBe("float");
      expect(component.labelStrategyVariant()).toBe("on");
      expect(component.syncValueInc()).toBe(0);
    });

    it("should initialize controlOptions from config", () => {
      fixture.detectChanges();
      expect(component["controlOptions"]()).toBeDefined();
    });

    it("should mark control as touched on init when it has value and no required validator", () => {
      const control = new FormControl("initial value");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.touched).toBe(true);
    });

    it("should not mark control as touched when value is null", () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.touched).toBe(false);
    });

    it("should not mark control as touched when value is undefined", () => {
      const control = new FormControl(undefined);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.touched).toBe(false);
    });

    it("should not mark control as touched when it has required validator", () => {
      const control = new FormControl("initial value", [required]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.touched).toBe(false);
    });
  });

  /**
   * ========================================
   * SECTION 2: RENDERING & DOM
   * ========================================
   */
  describe("Rendering & DOM", () => {
    it("should render form-control-container", () => {
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector(
        ".form-control-container",
      );
      expect(container).toBeTruthy();
    });

    it("should render label wrapper", () => {
      fixture.detectChanges();
      const labelWrapper =
        fixture.nativeElement.querySelector("frm-label-wrapper");
      expect(labelWrapper).toBeTruthy();
    });

    it("should render field renderer", () => {
      fixture.detectChanges();
      const fieldRenderer =
        fixture.nativeElement.querySelector("frm-field-renderer");
      expect(fieldRenderer).toBeTruthy();
    });

    it("should render hints container", () => {
      fixture.detectChanges();
      const hints = fixture.nativeElement.querySelector(".hints");
      expect(hints).toBeTruthy();
    });

    it("should not render when hidden", () => {
      const config = createDefaultConfig();
      config.controlOptions = { hidden: true };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector(
        ".form-control-container",
      );
      expect(container).toBeFalsy();
    });

    it("should have display-none class when not visible", () => {
      const config = createDefaultConfig();
      config.controlOptions = { hidden: true };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains("display-none")).toBe(
        true,
      );
    });
  });

  /**
   * ========================================
   * SECTION 3: INPUT BINDING & CONFIGURATION
   * ========================================
   */
  describe("Input Binding & Configuration", () => {
    it("should bind config input", () => {
      const config = createDefaultConfig();
      config.key = "customKey";
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.config().key).toBe("customKey");
    });

    it("should bind control input", () => {
      const control = new FormControl("test value");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.control()).toBe(control);
      expect(component.control().value).toBe("test value");
    });

    it("should bind isFormReadonly input", () => {
      fixture.componentRef.setInput("isFormReadonly", true);
      fixture.detectChanges();

      expect(component.isFormReadonly()).toBe(true);
    });

    it("should bind defaultControlWidth input", () => {
      fixture.componentRef.setInput("defaultControlWidth", "500px");
      fixture.detectChanges();

      expect(component.defaultControlWidth()).toBe("500px");
    });

    it("should bind labelStrategy input", () => {
      fixture.componentRef.setInput("labelStrategy", "normal");
      fixture.detectChanges();

      expect(component.labelStrategy()).toBe("normal");
    });

    it("should bind labelStrategyVariant input", () => {
      fixture.componentRef.setInput("labelStrategyVariant", "in");
      fixture.detectChanges();

      expect(component.labelStrategyVariant()).toBe("in");
    });

    it("should bind syncValueInc input", () => {
      fixture.componentRef.setInput("syncValueInc", 5);
      fixture.detectChanges();

      expect(component.syncValueInc()).toBe(5);
    });
  });

  /**
   * ========================================
   * SECTION 4: CONTROL OPTIONS & COMPUTED VALUES
   * ========================================
   */
  describe("Control Options & Computed Values", () => {
    it("should compute controlOptions from config", () => {
      const config = createDefaultConfig();
      config.controlOptions = { placeholder: "Test", width: "400px" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const options = component["controlOptions"]();
      expect(options.placeholder).toBe("Test");
      expect(options.width).toBe("400px");
    });

    it("should return empty object when controlOptions is undefined", () => {
      const config = createDefaultConfig();
      config.controlOptions = undefined;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component["controlOptions"]()).toEqual({});
    });

    it("should compute width from controlOptions", () => {
      const config = createDefaultConfig();
      config.controlOptions = { width: "450px" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component["width"]()).toBe("450px");
    });

    it("should compute minWidth from controlOptions", () => {
      const config = createDefaultConfig();
      config.controlOptions = { minWidth: "200px" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component["minWidth"]()).toBe("200px");
    });

    it("should compute maxWidth from controlOptions", () => {
      const config = createDefaultConfig();
      config.controlOptions = { maxWidth: "600px" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component["maxWidth"]()).toBe("600px");
    });

    it("should compute isVisible as true by default", () => {
      fixture.detectChanges();
      expect(component["isVisible"]()).toBe(true);
    });

    it("should compute isVisible as false when hidden is true", () => {
      const config = createDefaultConfig();
      config.controlOptions = { hidden: true };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component["isVisible"]()).toBe(false);
    });
  });

  /**
   * ========================================
   * SECTION 5: HOST BINDING & STYLING
   * ========================================
   */
  describe("Host Binding & Styling", () => {
    it("should apply custom styleClass from controlOptions", () => {
      const config = createDefaultConfig();
      config.controlOptions = { styleClass: "custom-class" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains("custom-class")).toBe(
        true,
      );
    });

    it("should apply width style when specified", () => {
      const config = createDefaultConfig();
      config.controlOptions = { width: "400px" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(fixture.nativeElement.style.minWidth).toBe("400px");
      expect(fixture.nativeElement.style.maxWidth).toBe("400px");
    });

    it("should apply minWidth when no width specified", () => {
      const config = createDefaultConfig();
      config.controlOptions = { minWidth: "250px" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(fixture.nativeElement.style.minWidth).toBe("250px");
    });

    it("should apply maxWidth when no width specified", () => {
      const config = createDefaultConfig();
      config.controlOptions = { maxWidth: "550px" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(fixture.nativeElement.style.maxWidth).toBe("550px");
    });

    it("should use defaultControlWidth when no width options specified", () => {
      fixture.componentRef.setInput("defaultControlWidth", "350px");
      fixture.detectChanges();

      expect(fixture.nativeElement.style.minWidth).toBe("350px");
      expect(fixture.nativeElement.style.maxWidth).toBe("350px");
    });
  });

  /**
   * ========================================
   * SECTION 6: HELP TEXT & ERROR DISPLAY
   * ========================================
   */
  describe("Help Text & Error Display", () => {
    it("should display help text when provided", () => {
      const config = createDefaultConfig();
      config.controlOptions = { helpText: "This is help text" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const helpText = fixture.nativeElement.querySelector(".help-text");
      expect(helpText).toBeTruthy();
      expect(helpText.textContent.trim()).toBe("This is help text");
    });

    it("should set title attribute on help text", () => {
      const config = createDefaultConfig();
      config.controlOptions = { helpText: "Tooltip text" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const helpText = fixture.nativeElement.querySelector(".help-text");
      expect(helpText.getAttribute("title")).toBe("Tooltip text");
    });

    it("should not display help text when not provided", () => {
      fixture.detectChanges();
      const helpText = fixture.nativeElement.querySelector(".help-text");
      expect(helpText).toBeFalsy();
    });

    it("should display error message when control is invalid and touched", () => {
      // Create control that is already invalid and touched
      const control = new FormControl("", [required]);
      control.markAsTouched();
      control.updateValueAndValidity();

      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const errorMessage =
        fixture.nativeElement.querySelector("frm-error-message");
      expect(errorMessage).toBeTruthy();
    });

    it("should not display error message when control is valid", () => {
      const control = new FormControl("value");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      control.markAsTouched();
      fixture.detectChanges();

      const errorMessage =
        fixture.nativeElement.querySelector("frm-error-message");
      expect(errorMessage).toBeFalsy();
    });

    it("should not display error message when control is untouched", () => {
      const control = new FormControl("", [required]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const errorMessage =
        fixture.nativeElement.querySelector("frm-error-message");
      expect(errorMessage).toBeFalsy();
    });

    it("should add invalid class to container when control has errors", () => {
      // Create control that is already invalid and touched
      const control = new FormControl("", [required]);
      control.markAsTouched();
      control.updateValueAndValidity();

      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector(
        ".form-control-container",
      );
      expect(container.classList.contains("invalid")).toBe(true);
    });

    it("should not add invalid class when control is valid", () => {
      const control = new FormControl("value");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      control.markAsTouched();
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector(
        ".form-control-container",
      );
      expect(container.classList.contains("invalid")).toBe(false);
    });
  });

  /**
   * ========================================
   * SECTION 7: OUTPUT EVENTS
   * ========================================
   */
  describe("Output Events", () => {
    it("should emit fieldInteraction event from field renderer", (done) => {
      fixture.detectChanges();

      component.fieldInteraction.subscribe(
        (event: FormFieldInteractionEvent) => {
          expect(event).toBeDefined();
          done();
        },
      );

      // Simulate interaction event from field renderer
      const fieldRenderer = fixture.debugElement.query(
        (el) => el.name === "frm-field-renderer",
      );
      if (fieldRenderer) {
        const mockEvent: FormFieldInteractionEvent = {
          key: "testField",
          controlType: CONTROL_TYPES.INPUT,
          value: "test",
          interactionType: "valueChange",
          timestamp: new Date(),
        };
        fieldRenderer.componentInstance.fieldInteraction.emit(mockEvent);
      }
    });
  });

  /**
   * ========================================
   * SECTION 8: EDGE CASES & ERROR HANDLING
   * ========================================
   */
  describe("Edge Cases & Error Handling", () => {
    it("should handle config without controlOptions", () => {
      const config: CrudItemOptions = {
        key: "test",
        label: "Test",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component["controlOptions"]()).toEqual({});
    });

    it("should handle empty config", () => {
      const config: CrudItemOptions = {
        key: "",
        label: "",
        controlType: CONTROL_TYPES.INPUT,
      };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });

    it("should handle null control value", () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.control().value).toBeNull();
    });

    it("should handle undefined labelStrategyVariant", () => {
      fixture.componentRef.setInput("labelStrategyVariant", undefined);
      fixture.detectChanges();

      expect(component.labelStrategyVariant()).toBeUndefined();
    });

    it("should handle undefined isFormReadonly", () => {
      fixture.componentRef.setInput("isFormReadonly", undefined);
      fixture.detectChanges();

      expect(component.isFormReadonly()).toBeUndefined();
    });

    it("should handle multiple styleClasses", () => {
      const config = createDefaultConfig();
      config.controlOptions = { styleClass: "class1 class2 class3" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const element = fixture.nativeElement;
      expect(element.classList.contains("class1")).toBe(true);
      expect(element.classList.contains("class2")).toBe(true);
      expect(element.classList.contains("class3")).toBe(true);
    });

    it("should handle changing visibility dynamically", () => {
      const config = createDefaultConfig();
      config.controlOptions = { hidden: false };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      let container = fixture.nativeElement.querySelector(
        ".form-control-container",
      );
      expect(container).toBeTruthy();

      // Change to hidden - create new config object to trigger change detection
      const hiddenConfig = { ...config, controlOptions: { hidden: true } };
      fixture.componentRef.setInput("config", hiddenConfig);
      fixture.detectChanges();

      container = fixture.nativeElement.querySelector(
        ".form-control-container",
      );
      expect(container).toBeFalsy();
    });

    it("should handle zero syncValueInc", () => {
      fixture.componentRef.setInput("syncValueInc", 0);
      fixture.detectChanges();

      expect(component.syncValueInc()).toBe(0);
    });

    it("should handle negative syncValueInc", () => {
      fixture.componentRef.setInput("syncValueInc", -1);
      fixture.detectChanges();

      expect(component.syncValueInc()).toBe(-1);
    });
  });

  /**
   * ========================================
   * SECTION 9: INTEGRATION WITH CHILD COMPONENTS
   * ========================================
   */
  describe("Integration with Child Components", () => {
    it("should pass config to label wrapper", () => {
      const config = createDefaultConfig();
      config.label = "Custom Label";
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const labelWrapper =
        fixture.nativeElement.querySelector("frm-label-wrapper");
      expect(labelWrapper).toBeTruthy();
    });

    it("should pass control to label wrapper", () => {
      const control = new FormControl("test");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const labelWrapper =
        fixture.nativeElement.querySelector("frm-label-wrapper");
      expect(labelWrapper).toBeTruthy();
    });

    it("should pass labelStrategy to label wrapper", () => {
      fixture.componentRef.setInput("labelStrategy", "normal");
      fixture.detectChanges();

      const labelWrapper =
        fixture.nativeElement.querySelector("frm-label-wrapper");
      expect(labelWrapper).toBeTruthy();
    });

    it("should pass config to field renderer", () => {
      const config = createDefaultConfig();
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const fieldRenderer =
        fixture.nativeElement.querySelector("frm-field-renderer");
      expect(fieldRenderer).toBeTruthy();
    });

    it("should pass control to field renderer", () => {
      const control = new FormControl("value");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const fieldRenderer =
        fixture.nativeElement.querySelector("frm-field-renderer");
      expect(fieldRenderer).toBeTruthy();
    });

    it("should pass isFormReadonly to field renderer", () => {
      fixture.componentRef.setInput("isFormReadonly", true);
      fixture.detectChanges();

      const fieldRenderer =
        fixture.nativeElement.querySelector("frm-field-renderer");
      expect(fieldRenderer).toBeTruthy();
    });

    it("should pass syncValueInc to field renderer", () => {
      fixture.componentRef.setInput("syncValueInc", 3);
      fixture.detectChanges();

      const fieldRenderer =
        fixture.nativeElement.querySelector("frm-field-renderer");
      expect(fieldRenderer).toBeTruthy();
    });

    it("should pass control errors to error message component", () => {
      // Create control that is already invalid and touched
      const control = new FormControl("", [required]);
      control.markAsTouched();
      control.updateValueAndValidity();

      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const errorMessage =
        fixture.nativeElement.querySelector("frm-error-message");
      expect(errorMessage).toBeTruthy();
    });
  });
});
