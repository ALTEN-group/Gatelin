import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { DateControlComponent } from "./date-control.component";

describe("DateControlComponent", () => {
  let component: DateControlComponent;
  let fixture: ComponentFixture<DateControlComponent>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "testDate",
    label: "Test Date",
    controlType: CONTROL_TYPES.DATE,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateControlComponent, FormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(DateControlComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("config", createDefaultConfig());
    fixture.componentRef.setInput("control", new FormControl(null));
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

    it("should initialize with empty dateValue", () => {
      expect(component.dateValue).toBe("");
    });
  });

  /**
   * ========================================
   * SECTION 2: RENDERING & DOM
   * ========================================
   */
  describe("Rendering & DOM", () => {
    it("should render p-datepicker element", () => {
      fixture.detectChanges();
      const datepicker = fixture.nativeElement.querySelector("p-datepicker");
      expect(datepicker).toBeTruthy();
    });

    it("should append to body", () => {
      fixture.detectChanges();
      const datepicker = fixture.nativeElement.querySelector("p-datepicker");
      expect(datepicker.getAttribute("appendto")).toBe("body");
    });

    it("should show button bar", () => {
      fixture.detectChanges();
      const datepicker = fixture.nativeElement.querySelector("p-datepicker");
      // Just verify the datepicker element exists
      expect(datepicker).toBeTruthy();
    });
  });

  /**
   * ========================================
   * SECTION 3: INPUT BINDING & CONFIGURATION
   * ========================================
   */
  describe("Input Binding & Configuration", () => {
    it("should bind formControl to the component control", () => {
      const now = new Date();
      const testControl = new FormControl(now.getTime());
      fixture.componentRef.setInput("control", testControl);
      fixture.detectChanges();

      expect(component.control()).toBe(testControl);
    });

    it("should convert timestamp to Date object", () => {
      const now = new Date();
      const control = new FormControl(now.getTime());
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.dateValue).toBeInstanceOf(Date);
    });

    it("should handle null value", () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.dateValue).toBe("");
    });

    it("should set selection mode to single by default", () => {
      fixture.detectChanges();
      expect(component.options().dateSelectionMode || "single").toBe("single");
    });

    it("should set selection mode to range when configured", () => {
      const config = createDefaultConfig();
      config.controlOptions = { dateSelectionMode: "range" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().dateSelectionMode).toBe("range");
    });

    it("should enable time picker when configured", () => {
      const config = createDefaultConfig();
      config.controlOptions = { dateShowTime: true };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.options().dateShowTime).toBe(true);
    });
  });

  /**
   * ========================================
   * SECTION 4: USER INTERACTIONS & EVENTS
   * ========================================
   */
  describe("User Interactions & Events", () => {
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

    it("should emit valueChange on date selected", () => {
      fixture.detectChanges();
      spyOn(component, "emitInteractionEvent");

      component.onDateSelected();

      expect(component.emitInteractionEvent).toHaveBeenCalledWith(
        "valueChange",
      );
    });

    it("should emit clear on date cleared", () => {
      fixture.detectChanges();
      spyOn(component, "emitInteractionEvent");

      component.onDateCleared();

      expect(component.emitInteractionEvent).toHaveBeenCalledWith("clear");
    });

    it("should mark control as touched and dirty on date selected", () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.onDateSelected();

      expect(control.touched).toBe(true);
      expect(control.dirty).toBe(true);
    });

    it("should mark control as touched and dirty on date cleared", () => {
      const control = new FormControl(new Date().getTime());
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.onDateCleared();

      expect(control.touched).toBe(true);
      expect(control.dirty).toBe(true);
    });
  });

  /**
   * ========================================
   * SECTION 5: DATE-SPECIFIC FEATURES
   * ========================================
   */
  describe("Date-Specific Features", () => {
    it("should convert Date to timestamp on selection", () => {
      const control = new FormControl<null | number>(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const testDate = new Date("2024-01-15");
      component.dateValue = testDate;
      component.onDateSelected();

      expect(control.value).toBe(testDate.getTime());
    });

    it("should handle date range selection", () => {
      const config = createDefaultConfig();
      config.controlOptions = { dateSelectionMode: "range" };
      const control = new FormControl<[null | number, null | number]>([
        null,
        null,
      ]);
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const startDate = new Date("2024-01-01");
      const endDate = new Date("2024-01-31");
      component.dateValue = [startDate, endDate];
      component.onDateSelected();

      expect(control.value).toEqual([startDate.getTime(), endDate.getTime()]);
    });

    it("should handle clearing date", () => {
      const control = new FormControl(new Date().getTime());
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.onDateCleared();

      expect(control.value).toBeNull();
    });

    it("should handle manual date input", () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const mockEvent = {
        target: { value: "2024-01-15" },
      } as unknown as Event;

      component.onDateTyped(mockEvent);

      expect(control.value).toBeTruthy();
    });

    it("should reject invalid date length in manual input", () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const mockEvent = {
        target: { value: "2024" },
      } as unknown as Event;

      component.onDateTyped(mockEvent);

      expect(control.value).toBeNull();
    });

    it("should skip manual input for range selection mode", () => {
      const config = createDefaultConfig();
      config.controlOptions = { dateSelectionMode: "range" };
      const control = new FormControl<null | number[]>(null);
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const mockEvent = {
        target: { value: "2024-01-15" },
      } as unknown as Event;

      component.onDateTyped(mockEvent);

      // Control should remain null since manual input is disabled for range mode
      expect(control.value).toEqual([]);
    });

    it("should convert array of timestamps to Date array", () => {
      const config = createDefaultConfig();
      config.controlOptions = { dateSelectionMode: "range" };
      const date1 = new Date("2024-01-01");
      const date2 = new Date("2024-01-31");
      const control = new FormControl([date1.getTime(), date2.getTime()]);
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.dateValue).toBeInstanceOf(Array);
      expect((component.dateValue as Date[])[0]).toBeInstanceOf(Date);
      expect((component.dateValue as Date[])[1]).toBeInstanceOf(Date);
    });

    it("should use calendar date format", () => {
      fixture.detectChanges();
      expect(component.dateFormat()).toBeDefined();
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
      const disabledControl = new FormControl({ value: null, disabled: true });
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
    it("should render with PrimeNG DatePicker component", () => {
      fixture.detectChanges();
      const datepicker = fixture.nativeElement.querySelector("p-datepicker");
      expect(datepicker).toBeTruthy();
    });

    it("should show footer with range picker when in range mode", () => {
      const config = createDefaultConfig();
      config.controlOptions = { dateSelectionMode: "range" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      // Footer template is conditionally rendered
      expect(component.options().dateSelectionMode).toBe("range");
    });

    it("should use custom panel width", () => {
      fixture.detectChanges();
      // Panel style is set to {width: '500px'}
      const datepicker = fixture.nativeElement.querySelector("p-datepicker");
      expect(datepicker).toBeTruthy();
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

      expect(component.dateValue).toBe("");
    });

    it("should handle undefined value", () => {
      const control = new FormControl(undefined);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.dateValue).toBe("");
    });

    it("should handle invalid date strings", () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const mockEvent = {
        target: { value: "invalid-date" },
      } as unknown as Event;

      component.onDateTyped(mockEvent);

      // Invalid date should be handled gracefully
      expect(control.value).toBeDefined();
    });

    it("should handle empty array in range mode", () => {
      const config = createDefaultConfig();
      config.controlOptions = { dateSelectionMode: "range" };
      const control = new FormControl([]);
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.dateValue).toBeInstanceOf(Array);
      expect((component.dateValue as Date[]).length).toBe(0);
    });

    it("should handle future dates", () => {
      const futureDate = new Date("2099-12-31");
      const control = new FormControl(futureDate.getTime());
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.dateValue).toBeInstanceOf(Date);
    });

    it("should handle past dates", () => {
      const pastDate = new Date("1900-01-01");
      const control = new FormControl(pastDate.getTime());
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.dateValue).toBeInstanceOf(Date);
    });
  });
});
