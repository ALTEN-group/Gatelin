import { Type } from "@angular/core";
import { AsyncValidatorFn, ValidatorFn } from "@angular/forms";
import { ControlArrayConfig } from "@crud/core/models/control-array-config.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { TableCtrlConfig } from "@form/ui/renderers/table-control/table-control-config.model";
import { SelectItem } from "primeng/api";
import { Observable } from "rxjs";

export interface ExtendedSelectItem extends SelectItem {
  extraData: unknown;
}

type ControlOnSearchFn = (event: string) => Observable<ExtendedSelectItem[]>;

export interface ControlActionResult {
  key: string;
  value: unknown;
  /**
   * When true, applies the action only if the target field is empty or has no value
   * @example `soft: true` // Only sets the value if the target field is currently empty
   */
  soft?: boolean;
  /**
   * Defines how the value should be applied to the target field
   * - 'set': Replaces the current value (default behavior)
   * - 'push': Adds the value to an array field
   * - 'remove': Removes the value from an array field
   * @example `mode: 'push'` // Adds the value to an existing array
   */
  mode?: "set" | "push" | "remove";
}

export type ControlAction = (
  event: FormFieldInteractionEvent,
) => ControlActionResult[] | undefined;

export class ControlOptions {
  /**
   * Defines the action to take when a form field interaction occurs -
   * allows setting values of other fields based on interactions
   */
  action?: ControlAction;
  /** Should the increment/decrement buttons be visible for number inputs
   * @default true
   * @example `areNumberInputButtonsVisible: false` // Hides the buttons
   */
  areNumberInputButtonsVisible?: boolean;
  /** Should the options in dropdowns and multiselects be filterable
   * @default true
   * @example `areOptionsFilterable: false` // Enables a search input to filter options
   */
  areOptionsFilterable?: boolean;
  /**
   * Specifies async validators for form control that perform asynchronous validation
   * @example `asyncValidators: [this.emailExistsValidator()]` // Custom async validator checking if email exists
   */
  asyncValidators?: AsyncValidatorFn[];
  /** Minimum number of characters required to trigger autocomplete suggestions
   * @example `autocompleteMinQueryLength: 3` // Suggestions appear after typing 3 characters
   */
  autocompleteMinQueryLength?: number;
  /** Delay in milliseconds before triggering autocomplete suggestions after user input
   * @example `autocompleteDelay: 300` // Waits 300ms after typing before fetching suggestions
   */
  autocompleteDelay?: number;
  /** Height of the autocomplete suggestions dropdown
   * @example `autocompleteScrollHeight: '200px'` // Sets the dropdown height to 200 pixels
   */
  autocompleteScrollHeight?: string;
  /** Should the autocomplete control allow selecting multiple values
   * @example `autocompleteMultiple: true` // Enables multi-select in autocomplete
   */
  autocompleteMultiple?: boolean;
  /** Should the autocomplete control show a dropdown button to display all options
   * @example `autocompleteDropdown: true` // Shows a dropdown button
   */
  autocompleteDropdown?: boolean;
  /**
   * Configuration for the FormArray control when isFormArray is true
   * @example `controlArrayConfig: { minItems: 1, maxItems: 5, addButtonLabel: 'Add Item' }`
   */
  controlArrayConfig?: ControlArrayConfig;
  /** Currency code for number inputs of type currency
   * @example `numberCurrency: 'USD'` // Displays values in US Dollars
   */
  numberCurrency?: string;
  /** Custom component to use as the form control instead of built-in types
   * @example `customComponent: MyCustomControlComponent` // Renders a custom Angular component as the form control
   **/
  customComponent?: Type<unknown>;
  /** Dates that should be disabled (not selectable) in the date picker
   * @example `dateDisabledDates: [new Date(2023, 0, 1), new Date(2023, 11, 25)]` // Disables January 1 and December 25, 2023
   */
  dateDisabledDates?: Date[];
  /** Days of the week that should be disabled in the date picker
   * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
   * @example `dateDisabledDays: [0,6]` // Disables all Sundays and Saturdays
   */
  dateDisabledDays?: number[];
  /** Date format string for displaying dates in the control
   * @example `dateFormat: 'dd/mm/yy'` // Displays dates in day/month/year format
   * @default 'yy-mm-dd'
   */
  dateFormat?: string;
  /** Minimum selectable date in the date picker
   * @example `dateMin: new Date(2020, 0, 1)` // Users cannot select dates before January 1, 2020
   */
  dateMin?: Date;
  /** Maximum selectable date in the date picker
   * @example `dateMax: new Date(2025, 11, 31)` // Users cannot select dates after December 31, 2025
   */
  dateMax?: Date;
  /** Should the date picker overlay hide automatically upon selecting a date
   * @default false
   * @example `dateHideOverlayOnSelect: true` // Closes the overlay when a date is selected
   */
  dateHideOverlayOnSelect?: boolean;
  /** Maximum number of dates that can be selected in 'multiple' selection mode
   * @example `dateMaxCount: 3` // Limits selection to 3 dates when in multiple mode
   */
  dateMaxCount?: number;
  /** Number of months to display simultaneously in the date picker overlay
   * Consider adjusting dateOverlayWidth accordingly for better display
   * @example `dateNumberOfMonths: 2` // Shows two months side by side in the overlay
   * @default 1
   */
  dateNumberOfMonths?: number;
  /** Width of the date picker overlay panel
   * @example `dateOverlayWidth: '400px'` // Sets the overlay width to 400 pixels
   * @default '500px'
   */
  dateOverlayWidth?: string;
  /** Should the date input be read-only, preventing manual typing
   * @example `dateReadonlyInput: true` // Users can only select dates via the picker, not type them
   * @default false
   */
  dateReadonlyInput?: boolean;
  /**
   * PrimeNG calendar mode: 'single' for one date, 'multiple' for several dates, 'range' for date range
   * @default 'single'
   * @example `dateSelectionMode: 'range'` // Allows selecting a start and end date
   */
  dateSelectionMode?: "single" | "multiple" | "range";
  /** Should the date picker show seconds in addition to hours and minutes
   * @example `dateShowSeconds: true` // Displays seconds selector in time selection
   */
  dateShowSeconds?: boolean;
  /**
   * Should the date picker show time selection in addition to date
   * Applicable only when dateSelectionMode is not defined or 'single'
   * @example `dateShowTime: true` // Shows hour and minute selectors
   */
  dateShowTime?: boolean;
  /** If true, only time selection will be shown without date
   * @example `dateTimeOnly: true` // Displays only time picker
   */
  dateTimeOnly?: boolean;
  /** Step increment for hours in time selection
   * @example `dateStepHours: 2` // Hours will increment in steps of 2
   */
  dateStepHours?: number;
  /** Step increment for minutes in time selection
   * @example `dateStepMinutes: 15` // Minutes will increment in steps of 15
   */
  dateStepMinutes?: number;
  /** Initial view mode for the date picker: 'date', 'month', or 'year'
   * @default 'date'
   * @example `dateViewMode: 'year'` // Opens the calendar in year selection mode
   */
  dateViewMode?: "date" | "month" | "year";
  /**
   * Defines the default value for an input when the form is initialized
   * @example `defaultValue: 'admin@example.com'` // Pre-fills the input with this value
   */
  defaultValue?: unknown;
  /**
   * Should the control be disabled (visible but not editable)
   * @example `disabled: true` // Control is grayed out and cannot be modified
   */
  disabled?: boolean;
  /**
   * @deprecated
   * Non applicable property - this will have no effect
   * If set to true, will force the control to always reset to the default value
   * @example `forceDefaultValue: true` // Control value will be reset to defaultValue on form reset
   */
  forceDefaultValue?: boolean;
  /**
   * Help text to display under the field to provide additional guidance
   * @example `helpText: 'Password must contain at least 8 characters with one uppercase letter'`
   */
  helpText?: string;
  /**
   * Should the control be hidden from the form
   * @example `hidden: true` // Control won't be displayed but will still be part of the form
   */
  hidden?: boolean;
  /**
   * Displays an icon in the left side of the input using PrimeNG icon classes
   * @example `inputIcon: 'pi pi-user'` // Shows a user icon inside the input field
   */
  inputIcon?: string;
  /** If true, allows clearing the field. Applicable for: number inputs, radio buttons, dropdowns, and autocomplete
   * @example `isClearable: true` // Shows a clear icon
   * @default true
   */
  isClearable?: boolean;
  /** If true, will prevent the options panel to show on focus */
  isCompleteOnFocusDisabled?: boolean;
  /**
   * Should the control be a FormArray instance for handling multiple values
   * @example `isFormArray: true` // Creates a FormArray instead of a FormControl
   */
  isFormArray?: boolean;
  /** If true, allows toggling between rich text and HTML source view in rich text editors
   * @example `isHtmlToggleable: true` // Shows a button to switch to HTML view
   */
  isHtmlToggleable?: boolean;
  /**
   * When enabled, allows user to create and select a new option in autocomplete when no results match
   * @example `isOptionCreationEnabled: true` // User can type a new value and it will be added as an option
   */
  isOptionCreationEnabled?: boolean;
  /** Enables a "Select All" option in multi-select controls
   * @default true
   * @example `isSelectAllEnabled: true` // Adds a "Select All" checkbox to select/deselect all options
   */
  isSelectAllEnabled?: boolean;
  /**
   * If the control should have a different label than the main label defined in CrudItemOptions
   * @example `label: 'Custom Field Name'` // Overrides the default label from CrudItemOptions
   */
  label?: string;
  /**
   * Defines the max value for an input of type number - should be used with corresponding validator
   * @example `max: 100` // Input value cannot exceed 100, use with Validators.max(100)
   */
  max?: number;
  /** Maximum number of fraction digits to display for number inputs */
  maxFractionDigits?: number;
  /**
   * Defines the max length for an input - should be used with corresponding validator
   * @example `maxLength: 50` // Input limited to 50 characters, use with Validators.maxLength(50)
   */
  maxLength?: number;
  /**
   * Specifies the maximum number of selected labels in a multi-select control
   * @example `maxSelectedLabels: 5` // Multi-select will show up to 5 selected labels before collapsing
   * @default undefined
   */
  maxSelectedLabels?: number;
  /**
   * Specifies a maximum width for the control, defaults to 50%
   * @example `maxWidth: '80%'` // Control will not exceed 80% of container width
   */
  maxWidth?: string;
  /**
   * Defines the min value for an input of type number - should be used with corresponding validator
   * @example `min: 100` // Input value cannot be less than 100, use with Validators.min(100)
   */
  min?: number;
  /** Minimum number of fraction digits to display for number inputs */
  minFractionDigits?: number;
  /**
   * Defines the min length for an input - should be used with corresponding validator
   * @example `minLength: 3` // Input requires at least 3 characters, use with Validators.minLength(3)
   */
  minLength?: number;
  /**
   * Specifies a minimum width for the control, defaults to 50%
   * @example `minWidth: '300px'` // Control will be at least 300px wide
   */
  minWidth?: string;
  /**
   * Enables multiple selection for select button controls - allows selecting multiple options simultaneously
   * @example `multipleSelectButton: true` // User can select multiple button options at once
   */
  multipleSelectButton?: boolean;
  /**
   * Allows deselecting/toggling select button options - enables clicking to unselect a previously selected option
   * @example `isSelectButtonOptionToggleable: true` // User can click a selected button to deselect it
   */
  isSelectButtonOptionToggleable?: boolean;
  /**
   * Placeholder text to display when the control has no value
   * @example `placeholder: 'Select an option'`
   */
  placeholder?: string;
  /** Direction for radio button options layout - 'row' for horizontal, 'column' for vertical
   * @example `radioOptionsDirection: 'row'` // Displays radio buttons in a horizontal row
   */
  radioOptionsDirection?: "row" | "column";
  /**
   * Specifies if the FormControl should be non-nullable (cannot have null values)
   * @example `nonNullable: true` // FormControl will reject null values and use default value instead
   */
  nonNullable?: boolean;
  /**
   * Defines the method to trigger for autocomplete suggestions - returns observable of options
   * @example `searchOptionsFn: (term) => this.userService.searchUsers(term)`
   */
  searchOptionsFn?: ControlOnSearchFn;
  /** Step value for number inputs - defines the increment/decrement step */
  step?: number;
  /** CSS class to apply to the form field wrapper component for styling purposes */
  styleClass?: string;
  /**
   * Columns to display when using TABLE control type - defines the table structure
   * @example `tableCtrlColumns: [
   *   { key: 'name', label: 'Name', controlType: CONTROL_TYPES.INPUT, type: INPUT_TYPES.TEXT },
   *   { key: 'age', label: 'Age', controlType: CONTROL_TYPES.INPUT, type: INPUT_TYPES.NUMBER }
   * ]`
   * @note Validators only handle 'required' at the moment for table-control columns
   */
  tableCtrlColumns?: CrudItemOptions[];
  /**
   * Store advanced configuration for table controls such as pagination, sorting, etc.
   * @example `tableCtrlConfig: { paginator: true, rows: 10, sortable: true }`
   */
  tableCtrlConfig?: Partial<TableCtrlConfig>;
  /** Height of the rich text editor control
   * @example `richTextEditorHeight: '300px'` // Sets the editor height to 300 pixels
   */
  textEditorHeight?: string;
  /**
   * Optional tooltip label that appears when hovering over the control
   * @example `tooltipLabel: 'Enter your email address used for notifications'`
   */
  tooltipLabel?: string;
  /** Whether to use grouping separators (e.g., thousands separators) for number inputs
   * @default false
   * @example `useNumberGrouping: true` // Displays numbers with grouping separators
   */
  useNumberGrouping?: boolean;
  /**
   * Specifies validators for form control
   *
   * When enabled on a simple FormControl, the validator will be applied on the control
   *
   * When enabled on a array control, the validator will be applied on each child
   * @example `validators: [Validators.required]` // or use `required` shared validator.
   */
  validators?: ValidatorFn[];
  /**
   * Specifies a fixed width for the control, will set both minWidth and maxWidth
   * @example `width: '250px'` // Control will be exactly 250px wide
   */
  width?: string;
  /**
   * Specifies the media type for the control of type FILES
   * @example `mediaType: 'image'` // Control will accept image files
   */
  mediaType?: "image" | string;
  /**
   * Whether to enable preview for uploaded files
   * @example `isPreviewEnabled: true` // Enables preview for uploaded images
   */
  isPreviewEnabled?: boolean;
  /**
   * Can the file input control accept multiple files for upload
   * @example `multiple: true` // User can select and upload multiple files at once
   */
  multiple?: boolean;
  /**
   * Maximum file size allowed in bytes
   * Will produce a form error when exceeded
   * @example `maxFileSize: 8000000` // Limits file size to 8MB
   */
  maxFileSize?: number;
}
