import { WritableSignal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemBase } from "@crud/core/models/crud-item-base.class";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { INPUT_TYPES } from "@crud/core/models/input-type.model";
import { TableControlComponent } from "./table-control.component";

interface TestWorkExperience extends CrudItemBase {
  company: string | null;
  position: string | null;
  startDate: Date | null;
  skills: string[] | null;
  internal_id?: number;
}

interface EventWithData extends FormFieldInteractionEvent {
  data?: Record<string, unknown>;
}

describe("TableControlComponent", () => {
  let component: TableControlComponent<TestWorkExperience>;
  let fixture: ComponentFixture<TableControlComponent<TestWorkExperience>>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "workExperience",
    label: "Work Experience",
    controlType: CONTROL_TYPES.TABLE,
    controlOptions: {
      tableCtrlConfig: {
        editionMode: "cell",
        filterable: false,
        sortable: false,
        selectable: false,
        isCreationEnabled: true,
        isDeletionEnabled: true,
        isHeaderHidden: false,
      },
      tableCtrlColumns: [
        {
          key: "company",
          label: "Company",
          controlType: CONTROL_TYPES.INPUT,
          type: INPUT_TYPES.TEXT,
          controlOptions: {
            validators: [Validators.required],
          },
        },
        {
          key: "position",
          label: "Position",
          controlType: CONTROL_TYPES.INPUT,
          type: INPUT_TYPES.TEXT,
        },
        {
          key: "startDate",
          label: "Start Date",
          controlType: CONTROL_TYPES.DATE,
        },
        {
          key: "skills",
          label: "Skills",
          controlType: CONTROL_TYPES.MULTISELECT,
          options: [
            { label: "JavaScript", value: "js" },
            { label: "TypeScript", value: "ts" },
            { label: "Angular", value: "angular" },
          ],
        },
      ],
    },
  });

  const createSampleData = (): TestWorkExperience[] => [
    {
      id: 1,
      company: "Tech Corp",
      position: "Developer",
      startDate: new Date("2020-01-01"),
      skills: ["js", "angular"],
      archived: false,
      archivedAt: null,
    },
    {
      id: 2,
      company: "Web Agency",
      position: "Senior Developer",
      startDate: new Date("2022-06-01"),
      skills: ["ts", "angular"],
      archived: false,
      archivedAt: null,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableControlComponent, ReactiveFormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(
      TableControlComponent<TestWorkExperience>,
    );
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

    it("should initialize with empty array when control value is null", () => {
      fixture.componentRef.setInput("control", new FormControl(null));
      fixture.detectChanges();
      expect(component.value()).toEqual([]);
    });

    it("should initialize with empty array when control value is not an array", () => {
      fixture.componentRef.setInput("control", new FormControl("invalid"));
      fixture.detectChanges();
      expect(component.value()).toEqual([]);
    });

    it("should initialize selectedRows as empty array", () => {
      fixture.detectChanges();
      expect(component.selectedRows()).toEqual([]);
    });

    it("should properly initialize value with sample data", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();
      expect(component.value().length).toBe(2);
    });
  });

  /**
   * ========================================
   * SECTION 2: RENDERING & DOM
   * ========================================
   */
  describe("Rendering & DOM", () => {
    it("should render p-table element", () => {
      fixture.detectChanges();
      const table = fixture.nativeElement.querySelector("p-table");
      expect(table).toBeTruthy();
    });

    it("should render table with table-control class", () => {
      fixture.detectChanges();
      const table = fixture.nativeElement.querySelector(".table-control");
      expect(table).toBeTruthy();
    });

    it("should render add button when isCreationEnabled is true", () => {
      fixture.detectChanges();
      const addButton = fixture.nativeElement.querySelector(
        'p-button[icon="pi pi-plus"]',
      );
      expect(addButton).toBeTruthy();
    });

    it("should render delete button when isDeletionEnabled is true", () => {
      fixture.detectChanges();
      const deleteButton = fixture.nativeElement.querySelector(
        'p-button[icon="pi pi-trash"]',
      );
      expect(deleteButton).toBeTruthy();
    });

    it("should not render add button when isCreationEnabled is false", () => {
      const config = createDefaultConfig();
      if (config.controlOptions?.tableCtrlConfig) {
        config.controlOptions.tableCtrlConfig.isCreationEnabled = false;
      }
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const addButton = fixture.nativeElement.querySelector(
        'p-button[icon="pi pi-plus"]',
      );
      expect(addButton).toBeFalsy();
    });

    it("should not render delete button when isDeletionEnabled is false", () => {
      const config = createDefaultConfig();
      if (config.controlOptions?.tableCtrlConfig) {
        config.controlOptions.tableCtrlConfig.isDeletionEnabled = false;
      }
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const deleteButton = fixture.nativeElement.querySelector(
        'p-button[icon="pi pi-trash"]',
      );
      expect(deleteButton).toBeFalsy();
    });
  });

  /**
   * ========================================
   * SECTION 3: TABLE CONFIGURATION
   * ========================================
   */
  describe("Table Configuration", () => {
    it("should return tableCtrlConfig from options", () => {
      fixture.detectChanges();
      const config = component.tableCtrlConfig();
      expect(config).toBeDefined();
      expect(config.editionMode).toBe("cell");
    });

    it("should return empty object when tableCtrlConfig is undefined", () => {
      const config = createDefaultConfig();
      if (config.controlOptions) {
        config.controlOptions.tableCtrlConfig = undefined;
      }
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.tableCtrlConfig()).toEqual({});
    });

    it("should determine isHeaderHidden from config", () => {
      fixture.detectChanges();
      expect(component.isHeaderHidden()).toBe(false);
    });

    it("should handle isHeaderHidden when set to true", () => {
      const config = createDefaultConfig();
      if (config.controlOptions?.tableCtrlConfig) {
        config.controlOptions.tableCtrlConfig.isHeaderHidden = true;
      }
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.isHeaderHidden()).toBe(true);
    });

    it("should default editionMode to cell", () => {
      fixture.detectChanges();
      expect(component.editionMode()).toBe("cell");
    });

    it("should support row edition mode", () => {
      const config = createDefaultConfig();
      if (config.controlOptions?.tableCtrlConfig) {
        config.controlOptions.tableCtrlConfig.editionMode = "row";
      }
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.editionMode()).toBe("row");
    });

    it("should compute columns from tableCtrlColumns", () => {
      fixture.detectChanges();
      const columns = component.columns();
      expect(columns.length).toBeGreaterThan(0);
      expect(columns[0].key).toBe("company");
    });

    it("should handle empty tableCtrlColumns", () => {
      const config = createDefaultConfig();
      if (config.controlOptions) {
        config.controlOptions.tableCtrlColumns = [];
      }
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.columns()).toEqual([]);
    });

    it("should respect sortedColumnKeys order", () => {
      const config = createDefaultConfig();
      if (config.controlOptions?.tableCtrlConfig) {
        config.controlOptions.tableCtrlConfig.sortedColumnKeys = [
          "skills",
          "company",
        ];
      }
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const columns = component.columns();
      expect(columns[0].key).toBe("skills");
      expect(columns[1].key).toBe("company");
    });
  });

  /**
   * ========================================
   * SECTION 4: SELECTABLE LOGIC
   * ========================================
   */
  describe("Selectable Logic", () => {
    it("should be selectable when selectable is true", () => {
      const config = createDefaultConfig();
      if (config.controlOptions?.tableCtrlConfig) {
        config.controlOptions.tableCtrlConfig.selectable = true;
      }
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.isSelectable()).toBe(true);
    });

    it("should be selectable when isDeletionEnabled is true", () => {
      const config = createDefaultConfig();
      if (config.controlOptions?.tableCtrlConfig) {
        config.controlOptions.tableCtrlConfig.selectable = false;
        config.controlOptions.tableCtrlConfig.isDeletionEnabled = true;
      }
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.isSelectable()).toBe(true);
    });

    it("should not be selectable when both are false", () => {
      const config = createDefaultConfig();
      if (config.controlOptions?.tableCtrlConfig) {
        config.controlOptions.tableCtrlConfig.selectable = false;
        config.controlOptions.tableCtrlConfig.isDeletionEnabled = false;
      }
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      expect(component.isSelectable()).toBe(false);
    });
  });

  /**
   * ========================================
   * SECTION 5: ADD ROW FUNCTIONALITY
   * ========================================
   */
  describe("Add Row Functionality", () => {
    it("should add a new empty row to the table", () => {
      const initialData = createSampleData();
      fixture.componentRef.setInput("control", new FormControl(initialData));
      fixture.detectChanges();

      const initialLength = component.value().length;
      component.onAddNewRow();

      expect(component.value().length).toBe(initialLength + 1);
    });

    it("should create new row with null values for all columns", () => {
      fixture.detectChanges();
      component.onAddNewRow();

      const newRow = component.value()[0];
      expect(newRow.company).toBeNull();
      expect(newRow.position).toBeNull();
      expect(newRow.startDate).toBeNull();
      expect(newRow.skills).toBeNull();
    });

    it("should assign unique internal_id to new row", () => {
      fixture.detectChanges();
      component.onAddNewRow();
      component.onAddNewRow();

      const rows = component.value();
      expect(rows[0].internal_id).toBeDefined();
      expect(rows[1].internal_id).toBeDefined();
      expect(rows[0].internal_id).not.toBe(rows[1].internal_id);
    });

    it("should update form control when adding row", () => {
      const control = new FormControl<TestWorkExperience[]>([]);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.onAddNewRow();

      expect(control.value?.length).toBe(1);
    });

    it("should add multiple rows correctly", () => {
      fixture.detectChanges();
      component.onAddNewRow();
      component.onAddNewRow();
      component.onAddNewRow();

      expect(component.value().length).toBe(3);
    });
  });

  /**
   * ========================================
   * SECTION 6: DELETE ROW FUNCTIONALITY
   * ========================================
   */
  describe("Delete Row Functionality", () => {
    it("should delete selected rows", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      (component.selectedRows as WritableSignal<TestWorkExperience[]>).set([
        component.value()[0],
      ]);
      component.onDeleteRows();

      expect(component.value().length).toBe(1);
      expect(component.value()[0].company).toBe("Web Agency");
    });

    it("should delete multiple selected rows", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const allRows = component.value();
      (component.selectedRows as WritableSignal<TestWorkExperience[]>).set([
        allRows[0],
        allRows[1],
      ]);
      component.onDeleteRows();

      expect(component.value().length).toBe(0);
    });

    it("should clear selectedRows after deletion", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      (component.selectedRows as WritableSignal<TestWorkExperience[]>).set([
        component.value()[0],
      ]);
      component.onDeleteRows();

      expect(component.selectedRows()).toEqual([]);
    });

    it("should update form control when deleting rows", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      (component.selectedRows as WritableSignal<TestWorkExperience[]>).set([
        component.value()[0],
      ]);
      component.onDeleteRows();

      expect(control.value?.length).toBe(1);
    });

    it("should handle deleting all rows", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const allRows = component.value();
      (component.selectedRows as WritableSignal<TestWorkExperience[]>).set(
        allRows,
      );
      component.onDeleteRows();

      expect(component.value()).toEqual([]);
    });
  });

  /**
   * ========================================
   * SECTION 7: CELL EDITING (CELL MODE)
   * ========================================
   */
  describe("Cell Editing (Cell Mode)", () => {
    it("should save cell value in cell mode", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.saveCellValue("New Company", "company", 0);

      expect(component.value()[0].company).toBe("New Company");
    });

    it("should emit cellEditComplete event when cell is saved", (done) => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.fieldInteraction.subscribe((event: EventWithData) => {
        if (event.interactionType === "cellEditComplete") {
          expect(event.extraData?.rowIndex).toBe(0);
          expect(event.extraData?.colKey).toBe("company");
          expect(event.extraData?.value).toBe("Updated Company");
          done();
        }
      });

      component.saveCellValue("Updated Company", "company", 0);
    });

    it("should not save cell value in row mode", () => {
      const config = createDefaultConfig();
      if (config.controlOptions?.tableCtrlConfig) {
        config.controlOptions.tableCtrlConfig.editionMode = "row";
      }
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const originalValue = component.value()[0].company;
      component.saveCellValue("New Company", "company", 0);

      expect(component.value()[0].company).toBe(originalValue);
    });

    it("should handle multiselect value save in cell mode", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.saveMultiselectValue(["js", "ts", "angular"], "skills", 0);

      expect(component.value()[0].skills).toEqual(["js", "ts", "angular"]);
    });
  });

  /**
   * ========================================
   * SECTION 8: ROW EDITING (ROW MODE)
   * ========================================
   */
  describe("Row Editing (Row Mode)", () => {
    beforeEach(() => {
      const config = createDefaultConfig();
      if (config.controlOptions?.tableCtrlConfig) {
        config.controlOptions.tableCtrlConfig.editionMode = "row";
      }
      fixture.componentRef.setInput("config", config);
    });

    it("should clone row on edit init", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const rowToEdit = component.value()[0];
      component.onRowEditInit(rowToEdit);

      expect(component["clonedRow"]).toBeDefined();
      expect(component["clonedRow"]?.company).toBe(rowToEdit.company);
    });

    it("should emit rowEditInit event", (done) => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.fieldInteraction.subscribe((event: EventWithData) => {
        if (event.interactionType === "rowEditInit") {
          expect(event.extraData?.row).toBeDefined();
          done();
        }
      });

      component.onRowEditInit(component.value()[0]);
    });

    it("should save row edits", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.onRowEditInit(component.value()[0]);
      component.value.update((rows) => {
        rows[0].company = "Modified Company";
        return rows;
      });
      component.onRowEditSave();

      expect(control.value?.[0].company).toBe("Modified Company");
      expect(component["clonedRow"]).toBeNull();
    });

    it("should emit rowEditComplete event on save", (done) => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.fieldInteraction.subscribe((event: EventWithData) => {
        if (event.interactionType === "rowEditComplete") {
          expect(event.extraData?.value).toBeDefined();
          done();
        }
      });

      component.onRowEditInit(component.value()[0]);
      component.onRowEditSave();
    });

    it("should cancel row edits and restore original values", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const originalCompany = component.value()[0].company;
      component.onRowEditInit(component.value()[0]);
      component.value.update((rows) => {
        rows[0].company = "Modified Company";
        return rows;
      });
      component.onRowEditCancel(0);

      expect(component.value()[0].company).toBe(originalCompany);
      expect(component["clonedRow"]).toBeNull();
    });

    it("should emit rowEditCancel event on cancel", (done) => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.fieldInteraction.subscribe((event: EventWithData) => {
        if (event.interactionType === "rowEditCancel") {
          expect(event.extraData?.value).toBeDefined();
          done();
        }
      });

      component.onRowEditInit(component.value()[0]);
      component.onRowEditCancel(0);
    });

    it("should handle multiselect changes in row mode", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.onMultiselectChange(0);

      expect(component.rowIndexWithUnsavedChanges()).toBe(0);
    });

    it("should clear rowIndexWithUnsavedChanges when multiselect is saved", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.onMultiselectChange(0);
      expect(component.rowIndexWithUnsavedChanges()).toBe(0);

      component.saveMultiselectValue(["js"], "skills", 0);
      expect(component.rowIndexWithUnsavedChanges()).toBeNull();
    });
  });

  /**
   * ========================================
   * SECTION 9: USER INTERACTIONS & EVENTS
   * ========================================
   */
  describe("User Interactions & Events", () => {
    it("should emit cellClicked event when cell is clicked", (done) => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      const config = createDefaultConfig();
      fixture.componentRef.setInput("config", config);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.fieldInteraction.subscribe((event: EventWithData) => {
        if (event.interactionType === "cellClicked") {
          expect(event.extraData?.row).toBeDefined();
          expect(event.extraData?.index).toBe(0);
          done();
        }
      });

      component.onCellClicked(component.value()[0], 0);
    });

    it("should emit rowsSelectionChange when selection changes", (done) => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.fieldInteraction.subscribe((event: EventWithData) => {
        if (event.interactionType === "rowsSelectionChange") {
          expect(event.extraData?.selectedRows).toBeDefined();
          done();
        }
      });

      (component.selectedRows as WritableSignal<TestWorkExperience[]>).set([
        component.value()[0],
      ]);
      component.onSelectionChanged();
    });
  });

  /**
   * ========================================
   * SECTION 10: READONLY & DISABLED STATES
   * ========================================
   */
  describe("Readonly & Disabled States", () => {
    it("should handle readonly state from parent", () => {
      fixture.componentRef.setInput("isFormReadonly", true);
      fixture.detectChanges();

      expect(component.isFormReadonly()).toBe(true);
    });

    it("should reflect disabled state from control", () => {
      const disabledControl = new FormControl({
        value: [],
        disabled: true,
      });
      fixture.componentRef.setInput("control", disabledControl);
      fixture.detectChanges();

      expect(component.isDisabled()).toBe(true);
    });

    it("should not be disabled by default", () => {
      fixture.detectChanges();
      expect(component.isDisabled()).toBe(false);
    });

    it("should add p-disabled class when disabled", () => {
      const disabledControl = new FormControl({
        value: [],
        disabled: true,
      });
      fixture.componentRef.setInput("control", disabledControl);
      fixture.detectChanges();

      const host = fixture.nativeElement;
      expect(host.classList.contains("p-disabled")).toBe(true);
    });
  });

  /**
   * ========================================
   * SECTION 11: DATA BINDING & VALUE UPDATES
   * ========================================
   */
  describe("Data Binding & Value Updates", () => {
    it("should bind control value to table", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.value().length).toBe(2);
      expect(component.value()[0].company).toBe("Tech Corp");
    });

    it("should add internal_id to each row", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      component.value().forEach((row) => {
        expect(row.internal_id).toBeDefined();
      });
    });
  });

  /**
   * ========================================
   * SECTION 12: EDGE CASES & ERROR HANDLING
   * ========================================
   */
  describe("Edge Cases & Error Handling", () => {
    it("should handle empty table data", () => {
      fixture.detectChanges();
      expect(component.value()).toEqual([]);
    });

    it("should handle null values in rows", () => {
      const dataWithNulls: TestWorkExperience[] = [
        {
          id: 1,
          company: null,
          position: null,
          startDate: null,
          skills: null,
          archived: false,
          archivedAt: null,
        },
      ];
      const control = new FormControl(dataWithNulls);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.value()[0].company).toBeNull();
    });

    it("should handle adding row with no columns defined", () => {
      const config = createDefaultConfig();
      if (config.controlOptions) {
        config.controlOptions.tableCtrlColumns = [];
      }
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      component.onAddNewRow();
      expect(component.value().length).toBe(1);
    });

    it("should handle deleting from empty selection", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      (component.selectedRows as WritableSignal<TestWorkExperience[]>).set([]);
      component.onDeleteRows();

      expect(component.value().length).toBe(2);
    });

    it("should handle cancel without prior edit init", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(() => component.onRowEditCancel(0)).not.toThrow();
    });

    it("should generate unique internal_id for each row", () => {
      const initialData = createSampleData();
      const control = new FormControl(initialData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      const ids = component.value().map((row) => row.internal_id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should handle very large datasets", () => {
      const largeData: TestWorkExperience[] = Array.from(
        { length: 1000 },
        (_, i) => ({
          id: i,
          company: `Company ${i}`,
          position: `Position ${i}`,
          startDate: new Date(),
          skills: ["js"],
          archived: false,
          archivedAt: null,
        }),
      );
      const control = new FormControl(largeData);
      fixture.componentRef.setInput("control", control);
      fixture.detectChanges();

      expect(component.value().length).toBe(1000);
    });
  });
});
