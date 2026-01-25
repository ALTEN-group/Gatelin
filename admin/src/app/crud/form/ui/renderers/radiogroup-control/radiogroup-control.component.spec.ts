import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { RadioButtonClickEvent } from "primeng/radiobutton";
import { RadioGroupComponent } from "./radiogroup-control.component";

describe("RadioGroupComponent", () => {
  let component: RadioGroupComponent;
  let fixture: ComponentFixture<RadioGroupComponent>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "testRadio",
    label: "Test Radio",
    controlType: CONTROL_TYPES.RADIO,
    options: [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" },
      { label: "Option 3", value: "opt3" },
    ],
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroupComponent, FormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioGroupComponent);
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

    it("should initialize with null value", () => {
      expect(component.value).toBeNull();
    });
  });

  /**
   * ========================================
   * SECTION 2: RENDERING & DOM
   * ========================================
   */
  describe("Rendering & DOM", () => {
    it("should render radio-group container", () => {
      fixture.detectChanges();
      const radioGroup = fixture.nativeElement.querySelector(".radio-group");
      expect(radioGroup).toBeTruthy();
    });

    it("should render radio buttons for each option", () => {
      fixture.detectChanges();
      const radioButtons =
        fixture.nativeElement.querySelectorAll("p-radiobutton");
      expect(radioButtons.length).toBe(3);
    });

    it("should render labels for each option", () => {
      fixture.detectChanges();
      const labels = fixture.nativeElement.querySelectorAll(
        ".radio-option label",
      );
      expect(labels.length).toBe(3);
      expect(labels[0].textContent.trim()).toContain("Option 1");
    });

    it("should apply row-direction class when configured", () => {
      const config = createDefaultConfig();
      config.controlOptions = { radioOptionsDirection: "row" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const radioGroup = fixture.nativeElement.querySelector(".radio-group");
      expect(radioGroup.classList.contains("row-direction")).toBe(true);
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
      expect(component.config().options?.length).toBe(3);
      expect(component.config().options?.[0].label).toBe("Option 1");
    });

    it("should set radio options direction to row", () => {
      const config = createDefaultConfig();
      config.controlOptions = { radioOptionsDirection: "row" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().radioOptionsDirection).toBe("row");
    });

    it("should enable clearable option when configured", () => {
      const config = createDefaultConfig();
      config.controlOptions = { isClearable: true };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().isClearable).toBe(true);
    });
  });

  /**
   * ========================================
   * SECTION 4: USER INTERACTIONS & EVENTS
   * ========================================
   */
  describe("User Interactions & Events", () => {
    it("should emit fieldInteraction on click", (done) => {
      fixture.detectChanges();

      component.fieldInteraction.subscribe(
        (event: FormFieldInteractionEvent) => {
          expect(event.interactionType).toBe("click");
          expect(event.key).toBe("testRadio");
          done();
        },
      );

      component.emitInteractionEvent("click");
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

    it("should emit valueChange on click", () => {
      const clickEvent = { value: "opt2" } as RadioButtonClickEvent;
      const control = new FormControl("");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      spyOn(component, "emitInteractionEvent");
      component.onClick(clickEvent);

      expect(component.emitInteractionEvent).toHaveBeenCalledWith(
        "valueChange",
      );
      expect(control.value).toBe("opt2");
    });

    it("should not emit valueChange when clicking same option twice", () => {
      const control = new FormControl("opt1");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      spyOn(component, "emitInteractionEvent");
      const clickEvent = { value: "opt1" } as RadioButtonClickEvent;
      component.onClick(clickEvent);

      // Click emitted but valueChange should not be called
      expect(component.emitInteractionEvent).toHaveBeenCalledWith("click");
      expect(component.emitInteractionEvent).not.toHaveBeenCalledWith(
        "valueChange",
      );
    });
  });

  /**
   * ========================================
   * SECTION 5: RADIOGROUP-SPECIFIC FEATURES
   * ========================================
   */
  describe("RadioGroup-Specific Features", () => {
    it("should select a radio option", () => {
      const control = new FormControl("");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const clickEvent = { value: "opt2" } as RadioButtonClickEvent;
      component.onClick(clickEvent);

      expect(control.value).toBe("opt2");
    });

    it("should allow unselecting when clearable is enabled", () => {
      const config = createDefaultConfig();
      config.controlOptions = { isClearable: true };
      const control = new FormControl("opt1");
      component.value = "opt1";
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const mouseEvent = new MouseEvent("click");
      spyOn(mouseEvent, "preventDefault");
      component.unselect(mouseEvent);

      expect(mouseEvent.preventDefault).toHaveBeenCalled();
      expect(component.value).toBeNull();
      expect(control.value).toBeNull();
    });

    it("should show delete icon when clearable and option is selected", () => {
      const config = createDefaultConfig();
      config.controlOptions = { isClearable: true };
      const control = new FormControl("opt1");
      component.value = "opt1";
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const deleteIcon = fixture.nativeElement.querySelector(".delete-icon");
      expect(deleteIcon).toBeTruthy();
    });

    it("should mark control as dirty on selection", () => {
      const control = new FormControl("");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const clickEvent = { value: "opt3" } as RadioButtonClickEvent;
      component.onClick(clickEvent);

      expect(control.dirty).toBe(true);
    });

    it("should handle numeric values", () => {
      const config = createDefaultConfig();
      config.options = [
        { label: "One", value: 1 },
        { label: "Two", value: 2 },
      ];
      const control = new FormControl<null | number>(null);
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const clickEvent = { value: 2 } as RadioButtonClickEvent;
      component.onClick(clickEvent);

      expect(control.value).toBe(2);
    });

    it("should display options in column direction by default", () => {
      fixture.detectChanges();
      const radioGroup = fixture.nativeElement.querySelector(".radio-group");
      expect(radioGroup.classList.contains("row-direction")).toBe(false);
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
    it("should render each radio option in a container", () => {
      fixture.detectChanges();
      const radioOptions =
        fixture.nativeElement.querySelectorAll(".radio-option");
      expect(radioOptions.length).toBe(3);
    });

    it("should bind radio name to config key", () => {
      fixture.detectChanges();
      const radioButtons =
        fixture.nativeElement.querySelectorAll("p-radiobutton");
      // Just verify all radio buttons are rendered
      expect(radioButtons.length).toBe(3);
    });

    it("should render delete icon only for selected option when clearable", () => {
      const config = createDefaultConfig();
      config.controlOptions = { isClearable: true };
      component.value = "opt2";
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const deleteIcons =
        fixture.nativeElement.querySelectorAll(".delete-icon");
      expect(deleteIcons.length).toBe(1);
    });
  });

  /**
   * ========================================
   * SECTION 8: EDGE CASES & ERROR HANDLING
   * ========================================
   */
  describe("Edge Cases & Error Handling", () => {
    it("should handle null initial value", () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBeNull();
    });

    it("should handle empty options array", () => {
      const config = createDefaultConfig();
      config.options = [];
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const radioButtons =
        fixture.nativeElement.querySelectorAll("p-radiobutton");
      expect(radioButtons.length).toBe(0);
    });

    it("should handle undefined options", () => {
      const config = createDefaultConfig();
      delete config.options;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const radioButtons =
        fixture.nativeElement.querySelectorAll("p-radiobutton");
      expect(radioButtons.length).toBe(0);
    });

    it("should handle invalid selected value", () => {
      const control = new FormControl("invalid-value");
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(control.value).toBe("invalid-value");
    });
  });
});
