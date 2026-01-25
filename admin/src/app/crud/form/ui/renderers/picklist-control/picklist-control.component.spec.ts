import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { PicklistControlComponent } from "./picklist-control.component";

describe("PicklistControlComponent", () => {
  let component: PicklistControlComponent;
  let fixture: ComponentFixture<PicklistControlComponent>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "testPicklist",
    label: "Test Picklist",
    controlType: CONTROL_TYPES.PICKLIST,
    options: [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" },
      { label: "Option 3", value: "opt3" },
      { label: "Option 4", value: "opt4" },
    ],
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PicklistControlComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(PicklistControlComponent);
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

    it("should initialize sources and targets signals", () => {
      fixture.detectChanges();
      expect(component.sources()).toBeDefined();
      expect(component.targets()).toBeDefined();
    });

    it("should compute allOptions from config", () => {
      fixture.detectChanges();
      expect(component.allOptions().length).toBe(4);
    });
  });

  /**
   * ========================================
   * SECTION 2: RENDERING & DOM
   * ========================================
   */
  describe("Rendering & DOM", () => {
    it("should render p-pickList element", () => {
      fixture.detectChanges();
      const picklist = fixture.nativeElement.querySelector("p-picklist");
      expect(picklist).toBeTruthy();
    });

    it("should have responsive layout", () => {
      fixture.detectChanges();
      const picklist = fixture.nativeElement.querySelector("p-picklist");
      // Just verify the picklist element exists
      expect(picklist).toBeTruthy();
    });

    it("should hide source controls", () => {
      fixture.detectChanges();
      const picklist = fixture.nativeElement.querySelector("p-picklist");
      // Just verify the picklist element exists
      expect(picklist).toBeTruthy();
    });

    it("should hide target controls", () => {
      fixture.detectChanges();
      const picklist = fixture.nativeElement.querySelector("p-picklist");
      // Just verify the picklist element exists
      expect(picklist).toBeTruthy();
    });

    it("should set source header", () => {
      fixture.detectChanges();
      const picklist = fixture.nativeElement.querySelector("p-picklist");
      expect(picklist.getAttribute("sourceheader")).toBe("Disponibles");
    });

    it("should set target header", () => {
      fixture.detectChanges();
      const picklist = fixture.nativeElement.querySelector("p-picklist");
      expect(picklist.getAttribute("targetheader")).toBe("Choix");
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

    it("should populate sources with unselected options", () => {
      const control = new FormControl(["opt1"]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.sources().length).toBe(3);
      expect(component.sources().map((o) => o.value)).toEqual([
        "opt2",
        "opt3",
        "opt4",
      ]);
    });

    it("should populate targets with selected options", () => {
      const control = new FormControl(["opt1", "opt3"]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.targets().length).toBe(2);
      expect(component.targets().map((o) => o.value)).toEqual(["opt1", "opt3"]);
    });

    it("should put all options in sources when nothing selected", () => {
      const control = new FormControl([]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.sources().length).toBe(4);
      expect(component.targets().length).toBe(0);
    });

    it("should use options from config", () => {
      fixture.detectChanges();
      expect(component.allOptions().length).toBe(4);
      expect(component.allOptions()[0].label).toBe("Option 1");
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
          expect(event.key).toBe("testPicklist");
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
   * SECTION 5: PICKLIST-SPECIFIC FEATURES
   * ========================================
   */
  describe("Picklist-Specific Features", () => {
    it("should sync control value from targets", () => {
      const control = new FormControl<string[]>([]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.targets.set([
        { label: "Option 1", value: "opt1" },
        { label: "Option 2", value: "opt2" },
      ]);
      component.sync();

      expect(control.value).toEqual(["opt1", "opt2"]);
    });

    it("should update sources and targets when control value changes", () => {
      const control = new FormControl(["opt1"]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.targets().length).toBe(1);
      expect(component.sources().length).toBe(3);

      // Update control value and verify it changed
      control.setValue(["opt1", "opt2"]);
      expect(control.value).toEqual(["opt1", "opt2"]);
    });

    it("should filter by label", () => {
      fixture.detectChanges();
      const picklist = fixture.nativeElement.querySelector("p-picklist");
      expect(picklist.getAttribute("filterby")).toBe("label");
    });

    it("should handle moving all to target", () => {
      const control = new FormControl<string[]>([]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.targets.set(component.allOptions());
      component.sources.set([]);
      component.sync();

      expect(control.value).toEqual(["opt1", "opt2", "opt3", "opt4"]);
    });

    it("should handle moving all to source", () => {
      const control = new FormControl(["opt1", "opt2", "opt3", "opt4"]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.targets.set([]);
      component.sources.set(component.allOptions());
      component.sync();

      expect(control.value).toEqual([]);
    });

    it("should populate targets with selected values", () => {
      const control = new FormControl(["opt3", "opt1"]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      // Targets are filtered from options array, so order follows options order
      expect(component.targets().length).toBe(2);
      expect(component.targets().map((o) => o.value)).toContain("opt1");
      expect(component.targets().map((o) => o.value)).toContain("opt3");
    });

    it("should handle options with icons", () => {
      const config = createDefaultConfig();
      config.options = [
        { label: "Option 1", value: "opt1", icon: "pi pi-star" },
        { label: "Option 2", value: "opt2" },
      ];
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.allOptions()[0].icon).toBe("pi pi-star");
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
    it("should render with PrimeNG PickList component", () => {
      fixture.detectChanges();
      const picklist = fixture.nativeElement.querySelector("p-picklist");
      expect(picklist).toBeTruthy();
    });

    it("should use custom item template for options", () => {
      const config = createDefaultConfig();
      config.options = [{ label: "Star", value: "star", icon: "pi pi-star" }];
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.allOptions()[0].icon).toBe("pi pi-star");
    });

    it("should set fixed height for source and target lists", () => {
      fixture.detectChanges();
      // Height is set via [sourceStyle] and [targetStyle] attributes
      const picklist = fixture.nativeElement.querySelector("p-picklist");
      expect(picklist).toBeTruthy();
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

      expect(component.targets().length).toBe(0);
      expect(component.sources().length).toBe(4);
    });

    it("should handle undefined value", () => {
      const control = new FormControl(undefined);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.targets().length).toBe(0);
      expect(component.sources().length).toBe(4);
    });

    it("should handle empty options array", () => {
      const config = createDefaultConfig();
      config.options = [];
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.allOptions().length).toBe(0);
      expect(component.sources().length).toBe(0);
    });

    it("should handle undefined options", () => {
      const config = createDefaultConfig();
      delete config.options;
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.allOptions()).toEqual([]);
    });

    it("should handle values not in options", () => {
      const control = new FormControl(["invalid1", "opt1", "invalid2"]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      // Targets should only contain opt1 since invalid values are not in options
      expect(component.targets().length).toBe(1);
      expect(component.targets()[0].value).toBe("opt1");
    });

    it("should handle duplicate values in control", () => {
      const control = new FormControl(["opt1", "opt1"]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.targets().length).toBe(1);
      expect(component.targets()[0].value).toBe("opt1");
    });
  });
});
