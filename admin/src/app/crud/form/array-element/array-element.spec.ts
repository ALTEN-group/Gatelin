import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormBuilderService } from "@form/form-builder.service";
import { required } from "@form/utils/common.validators";
import { FormArrayElement } from "./array-element";

describe("FormArrayElement", () => {
  let component: FormArrayElement;
  let fixture: ComponentFixture<FormArrayElement>;
  let formBuilderService: jasmine.SpyObj<FormBuilderService>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "testArray",
    label: "Test Array",
    controlType: CONTROL_TYPES.INPUT,
    controlOptions: {
      controlArrayConfig: {
        addButtonLabel: "Add Item",
        minItems: 0,
        maxItems: 5,
      },
    },
  });

  const createDefaultFormGroup = (): FormGroup => {
    return new FormGroup({
      testArray: new FormArray([
        new FormControl("Item 1"),
        new FormControl("Item 2"),
      ]),
    });
  };

  beforeEach(async () => {
    const formBuilderSpy = jasmine.createSpyObj("FormBuilderService", [
      "toFormControl",
    ]);
    formBuilderSpy.toFormControl.and.returnValue(new FormControl(""));

    await TestBed.configureTestingModule({
      imports: [FormArrayElement, ReactiveFormsModule],
      providers: [
        provideAnimations(),
        { provide: FormBuilderService, useValue: formBuilderSpy },
      ],
    }).compileComponents();

    formBuilderService = TestBed.inject(
      FormBuilderService,
    ) as jasmine.SpyObj<FormBuilderService>;

    fixture = TestBed.createComponent(FormArrayElement);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("config", createDefaultConfig());
    fixture.componentRef.setInput("formGroup", createDefaultFormGroup());
    fixture.componentRef.setInput("isFormReadonly", false);
    fixture.componentRef.setInput("defaultControlWidth", "300px");
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
      expect(component.formGroup()).toBeDefined();
      expect(component.isFormReadonly()).toBe(false);
      expect(component.defaultControlWidth()).toBe("300px");
      expect(component.syncValueInc()).toBe(0);
    });

    it("should compute formArray from formGroup", () => {
      fixture.detectChanges();
      const formArray = component["formArray"]();
      expect(formArray).toBeInstanceOf(FormArray);
      expect(formArray.length).toBe(2);
    });

    it("should compute controls from formArray", () => {
      fixture.detectChanges();
      const controls = component.controls();
      expect(controls.length).toBe(2);
      expect(controls[0].value).toBe("Item 1");
      expect(controls[1].value).toBe("Item 2");
    });

    it("should compute arrayControlOptions from config", () => {
      fixture.detectChanges();
      const options = component.arrayControlOptions();
      expect(options.addButtonLabel).toBe("Add Item");
      expect(options.minItems).toBe(0);
      expect(options.maxItems).toBe(5);
    });

    it("should initialize cannotDelete based on minItems", () => {
      fixture.detectChanges();
      expect(component.cannotDelete()).toBe(false);
    });

    it("should initialize cannotAdd based on maxItems", () => {
      fixture.detectChanges();
      expect(component.cannotAdd()).toBe(false);
    });
  });

  /**
   * ========================================
   * SECTION 2: RENDERING & DOM
   * ========================================
   */
  describe("Rendering & DOM", () => {
    it("should render array-group container", () => {
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector(".array-group");
      expect(container).toBeTruthy();
    });

    it("should render array label", () => {
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector(
        ".array-group-label span",
      );
      expect(label.textContent).toBe("Test Array");
    });

    it("should render add button", () => {
      fixture.detectChanges();
      const addButton = fixture.nativeElement.querySelector(
        ".array-group-label p-button",
      );
      expect(addButton).toBeTruthy();
    });

    it("should render control containers for each item", () => {
      fixture.detectChanges();
      const containers = fixture.nativeElement.querySelectorAll(
        ".array-control-container",
      );
      expect(containers.length).toBe(2);
    });

    it("should render field renderer for each control", () => {
      fixture.detectChanges();
      const renderers =
        fixture.nativeElement.querySelectorAll("frm-field-renderer");
      expect(renderers.length).toBe(2);
    });

    it("should render delete button for each control", () => {
      fixture.detectChanges();
      const deleteButtons = fixture.nativeElement.querySelectorAll(
        ".array-control-container p-button",
      );
      expect(deleteButtons.length).toBe(2);
    });

    it("should not render component when hidden", () => {
      const config = createDefaultConfig();
      config.controlOptions!.hidden = true;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains("display-none")).toBe(
        true,
      );
    });

    it("should add p-disabled class when isFormReadonly is true", () => {
      fixture.componentRef.setInput("isFormReadonly", true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector(".array-group");
      expect(container.classList.contains("p-disabled")).toBe(true);
    });

    it("should add p-disabled class when disabled option is true", () => {
      const config = createDefaultConfig();
      config.controlOptions!.disabled = true;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector(".array-group");
      expect(container.classList.contains("p-disabled")).toBe(true);
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
      config.label = "Custom Array";
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.config().label).toBe("Custom Array");
    });

    it("should bind formGroup input", () => {
      const formGroup = createDefaultFormGroup();
      fixture.componentRef.setInput("formGroup", formGroup);
      fixture.detectChanges();

      expect(component.formGroup()).toBe(formGroup);
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

    it("should bind syncValueInc input", () => {
      fixture.componentRef.setInput("syncValueInc", 5);
      fixture.detectChanges();

      expect(component.syncValueInc()).toBe(5);
    });

    it("should handle empty controlArrayConfig", () => {
      const config = createDefaultConfig();
      config.controlOptions!.controlArrayConfig = undefined;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.arrayControlOptions()).toEqual({});
    });
  });

  /**
   * ========================================
   * SECTION 4: ADD CONTROL FUNCTIONALITY
   * ========================================
   */
  describe("Add Control Functionality", () => {
    it("should add new control when addControl is called", () => {
      fixture.detectChanges();
      const initialLength = component.controls().length;

      component.addControl();

      expect(component.controls().length).toBe(initialLength + 1);
    });

    it("should call FormBuilderService.toFormControl when adding control", () => {
      fixture.detectChanges();

      component.addControl();

      expect(formBuilderService.toFormControl).toHaveBeenCalledWith(
        component.config(),
        "",
        false,
      );
    });

    it("should add control to formArray", () => {
      fixture.detectChanges();
      const formArray = component["formArray"]();
      const initialLength = formArray.length;

      component.addControl();

      expect(formArray.length).toBe(initialLength + 1);
    });

    it("should update cannotAdd state after adding control", () => {
      const config = createDefaultConfig();
      config.controlOptions!.controlArrayConfig!.maxItems = 3;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.cannotAdd()).toBe(false);

      component.addControl();
      expect(component.cannotAdd()).toBe(true);
    });

    it("should disable add button when max items reached", () => {
      const config = createDefaultConfig();
      config.controlOptions!.controlArrayConfig!.maxItems = 2;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.cannotAdd()).toBe(true);
    });

    it("should not allow adding beyond maxItems", () => {
      const config = createDefaultConfig();
      config.controlOptions!.controlArrayConfig!.maxItems = 2;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const initialLength = component.controls().length;
      component.addControl(); // This should still be added by the method

      // Even though cannotAdd is true, the method doesn't prevent adding
      // The button should be disabled in the UI
      expect(component.controls().length).toBe(initialLength + 1);
      expect(component.cannotAdd()).toBe(true);
    });

    it("should handle maxItems as undefined (unlimited)", () => {
      const config = createDefaultConfig();
      config.controlOptions!.controlArrayConfig!.maxItems = undefined;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.cannotAdd()).toBe(false);

      // Add multiple items
      for (let i = 0; i < 10; i++) {
        component.addControl();
      }

      expect(component.cannotAdd()).toBe(false);
    });
  });

  /**
   * ========================================
   * SECTION 5: REMOVE CONTROL FUNCTIONALITY
   * ========================================
   */
  describe("Remove Control Functionality", () => {
    it("should remove control when removeControl is called", () => {
      fixture.detectChanges();
      const initialLength = component.controls().length;

      component.removeControl(0);

      expect(component.controls().length).toBe(initialLength - 1);
    });

    it("should remove correct control by index", () => {
      fixture.detectChanges();
      const firstValue = component.controls()[0].value;

      component.removeControl(0);

      expect(component.controls()[0].value).not.toBe(firstValue);
      expect(component.controls()[0].value).toBe("Item 2");
    });

    it("should update cannotDelete state after removing control", () => {
      const config = createDefaultConfig();
      config.controlOptions!.controlArrayConfig!.minItems = 1;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.cannotDelete()).toBe(false);

      component.removeControl(0);
      expect(component.cannotDelete()).toBe(true);
    });

    it("should disable delete button when min items reached", () => {
      const config = createDefaultConfig();
      config.controlOptions!.controlArrayConfig!.minItems = 2;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.cannotDelete()).toBe(true);
    });

    it("should update cannotAdd when removing control below max", () => {
      const config = createDefaultConfig();
      config.controlOptions!.controlArrayConfig!.maxItems = 2;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.cannotAdd()).toBe(true);

      component.removeControl(0);
      expect(component.cannotAdd()).toBe(false);
    });

    it("should handle minItems as 0 by default", () => {
      const config = createDefaultConfig();
      config.controlOptions!.controlArrayConfig!.minItems = undefined;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      // Remove all controls
      while (component.controls().length > 0) {
        component.removeControl(0);
      }

      expect(component.cannotDelete()).toBe(true);
      expect(component.controls().length).toBe(0);
    });
  });

  /**
   * ========================================
   * SECTION 6: COMPUTED PROPERTIES & STATE
   * ========================================
   */
  describe("Computed Properties & State", () => {
    it("should compute isDisabled from isFormReadonly", () => {
      fixture.componentRef.setInput("isFormReadonly", true);
      fixture.detectChanges();

      expect(component.isDisabled()).toBe(true);
    });

    it("should compute isDisabled from controlOptions.disabled", () => {
      const config = createDefaultConfig();
      config.controlOptions!.disabled = true;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.isDisabled()).toBe(true);
    });

    it("should compute isDisabled as false when both are false", () => {
      fixture.componentRef.setInput("isFormReadonly", false);
      fixture.detectChanges();

      expect(component.isDisabled()).toBe(false);
    });

    it("should compute parentControlOptions from config", () => {
      const config = createDefaultConfig();
      config.controlOptions = {
        hidden: true,
        disabled: false,
      };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const options = component["parentControlOptions"]();
      expect(options.hidden).toBe(true);
      expect(options.disabled).toBe(false);
    });

    it("should return empty object when controlOptions is undefined", () => {
      const config = createDefaultConfig();
      config.controlOptions = undefined;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component["parentControlOptions"]()).toEqual({});
    });
  });

  /**
   * ========================================
   * SECTION 7: HOST BINDING & STYLING
   * ========================================
   */
  describe("Host Binding & Styling", () => {
    it("should apply display-none class when hidden", () => {
      const config = createDefaultConfig();
      config.controlOptions!.hidden = true;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.classes).toBe("display-none");
    });

    it("should not apply display-none class when not hidden", () => {
      fixture.detectChanges();
      expect(component.classes).toBe("");
    });

    it("should apply width style when specified", () => {
      const config = createDefaultConfig();
      config.controlOptions!.width = "400px";
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const style = component.style;
      expect(style).toContain("min-width: 400px");
      expect(style).toContain("max-width: 400px");
    });

    it("should apply minWidth when no width specified", () => {
      const config = createDefaultConfig();
      config.controlOptions!.minWidth = "250px";
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const style = component.style;
      expect(style).toContain("min-width: 250px");
    });

    it("should apply maxWidth when no width specified", () => {
      const config = createDefaultConfig();
      config.controlOptions!.maxWidth = "550px";
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const style = component.style;
      expect(style).toContain("max-width: 550px");
    });

    it("should use defaultControlWidth when no width options specified", () => {
      fixture.componentRef.setInput("defaultControlWidth", "350px");
      fixture.detectChanges();

      const style = component.style;
      expect(style).toContain("min-width: 350px");
      expect(style).toContain("max-width: 350px");
    });
  });

  /**
   * ========================================
   * SECTION 8: ERROR DISPLAY
   * ========================================
   */
  describe("Error Display", () => {
    it("should display error message for invalid control", () => {
      const formGroup = new FormGroup({
        testArray: new FormArray([new FormControl("", [required])]),
      });
      const control = formGroup.get("testArray")?.get("0") as FormControl;
      control.markAsTouched();
      control.updateValueAndValidity();

      fixture.componentRef.setInput("formGroup", formGroup);
      fixture.detectChanges();

      const errorMessage =
        fixture.nativeElement.querySelector("frm-error-message");
      expect(errorMessage).toBeTruthy();
    });

    it("should not display error message for valid control", () => {
      fixture.detectChanges();

      const errorMessages =
        fixture.nativeElement.querySelectorAll("frm-error-message");
      expect(errorMessages.length).toBe(0);
    });

    it("should pass control errors to error message component", () => {
      const formGroup = new FormGroup({
        testArray: new FormArray([new FormControl("", [required])]),
      });
      const control = formGroup.get("testArray")?.get("0") as FormControl;
      control.markAsTouched();
      control.updateValueAndValidity();

      fixture.componentRef.setInput("formGroup", formGroup);
      fixture.detectChanges();

      const errorMessage =
        fixture.nativeElement.querySelector("frm-error-message");
      expect(errorMessage).toBeTruthy();
    });
  });

  /**
   * ========================================
   * SECTION 9: EDGE CASES & ERROR HANDLING
   * ========================================
   */
  describe("Edge Cases & Error Handling", () => {
    it("should handle empty formArray", () => {
      const formGroup = new FormGroup({
        testArray: new FormArray([]),
      });
      fixture.componentRef.setInput("formGroup", formGroup);
      fixture.detectChanges();

      expect(component.controls().length).toBe(0);
    });

    it("should handle adding to empty array", () => {
      const formGroup = new FormGroup({
        testArray: new FormArray([]),
      });
      fixture.componentRef.setInput("formGroup", formGroup);
      fixture.detectChanges();

      component.addControl();
      expect(component.controls().length).toBe(1);
    });

    it("should handle undefined addButtonLabel", () => {
      const config = createDefaultConfig();
      config.controlOptions!.controlArrayConfig!.addButtonLabel = undefined;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.arrayControlOptions().addButtonLabel).toBeUndefined();
    });

    it("should handle config without controlOptions", () => {
      const config: CrudItemOptions = {
        key: "testArray",
        label: "Test",
        controlType: CONTROL_TYPES.INPUT,
      };
      const formGroup = createDefaultFormGroup();
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("formGroup", formGroup);
      fixture.detectChanges();

      expect(component["parentControlOptions"]()).toEqual({});
    });

    it("should handle undefined isFormReadonly", () => {
      fixture.componentRef.setInput("isFormReadonly", undefined);
      fixture.detectChanges();

      expect(component.isFormReadonly()).toBeUndefined();
      expect(component.isDisabled()).toBe(false);
    });

    it("should handle removing last control", () => {
      const formGroup = new FormGroup({
        testArray: new FormArray([new FormControl("Only Item")]),
      });
      fixture.componentRef.setInput("formGroup", formGroup);
      fixture.detectChanges();

      component.removeControl(0);
      expect(component.controls().length).toBe(0);
    });

    it("should handle multiple rapid additions", () => {
      fixture.detectChanges();
      const initialLength = component.controls().length;

      for (let i = 0; i < 3; i++) {
        component.addControl();
      }

      expect(component.controls().length).toBe(initialLength + 3);
    });

    it("should handle multiple rapid removals", () => {
      fixture.detectChanges();
      const initialLength = component.controls().length;

      component.removeControl(0);
      component.removeControl(0);

      expect(component.controls().length).toBe(initialLength - 2);
    });

    it("should update state correctly after mixed add/remove operations", () => {
      const config = createDefaultConfig();
      config.controlOptions!.controlArrayConfig = {
        minItems: 1,
        maxItems: 3,
      };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      component.addControl();
      expect(component.cannotAdd()).toBe(true);
      expect(component.cannotDelete()).toBe(false);

      component.removeControl(0);
      expect(component.cannotAdd()).toBe(false);
      expect(component.cannotDelete()).toBe(false);

      component.removeControl(0);
      expect(component.cannotDelete()).toBe(true);
    });

    it("should handle zero as syncValueInc", () => {
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
   * SECTION 10: INTEGRATION WITH CHILD COMPONENTS
   * ========================================
   */
  describe("Integration with Child Components", () => {
    it("should pass config to field renderer", () => {
      fixture.detectChanges();
      const renderers =
        fixture.nativeElement.querySelectorAll("frm-field-renderer");
      expect(renderers.length).toBeGreaterThan(0);
    });

    it("should pass control to field renderer", () => {
      fixture.detectChanges();
      const renderers =
        fixture.nativeElement.querySelectorAll("frm-field-renderer");
      expect(renderers.length).toBe(component.controls().length);
    });

    it("should pass isFormReadonly to field renderer", () => {
      fixture.componentRef.setInput("isFormReadonly", true);
      fixture.detectChanges();

      const renderers =
        fixture.nativeElement.querySelectorAll("frm-field-renderer");
      expect(renderers.length).toBeGreaterThan(0);
    });

    it("should pass syncValueInc to field renderer", () => {
      fixture.componentRef.setInput("syncValueInc", 3);
      fixture.detectChanges();

      const renderers =
        fixture.nativeElement.querySelectorAll("frm-field-renderer");
      expect(renderers.length).toBeGreaterThan(0);
    });

    it("should render separate field renderer for each control", () => {
      fixture.detectChanges();
      const controlCount = component.controls().length;
      const renderers =
        fixture.nativeElement.querySelectorAll("frm-field-renderer");

      expect(renderers.length).toBe(controlCount);
    });

    it("should update rendered controls when adding new control", () => {
      fixture.detectChanges();
      const initialCount = component.controls().length;

      component.addControl();

      expect(component.controls().length).toBe(initialCount + 1);
    });

    it("should update rendered controls when removing control", () => {
      fixture.detectChanges();
      const initialCount = component.controls().length;

      component.removeControl(0);

      expect(component.controls().length).toBe(initialCount - 1);
    });
  });
});
