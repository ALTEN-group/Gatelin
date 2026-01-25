# Control Options Documentation

## ControlActionResult Interface

The `ControlActionResult` interface defines the structure for action results that can be returned by control actions. These actions allow you to programmatically modify other form fields based on user interactions.

### Properties

#### `key: string`
The key/name of the target form field that should be modified.

#### `value: unknown`
The value to be applied to the target field.

#### `soft?: boolean`
When `true`, applies the action only if the target field is empty or has no value. This prevents overwriting existing user input.

#### `mode?: "set" | "push" | "remove"`
Defines how the value should be applied to the target field:
- `"set"`: Replaces the current value (default behavior)
- `"push"`: Adds the value to an array field
- `"remove"`: Removes the value from an array field

### Examples

#### Basic Field Update
```typescript
// Simple field update - replaces the value
{
  key: 'email',
  value: 'user@example.com'
}
```

#### Soft Update (Only if Empty)
```typescript
// Only sets the default country if the field is currently empty
{
  key: 'country',
  value: 'US',
  soft: true
}
```

#### Array Operations

##### Adding to Array (Push Mode)
```typescript
// Adds a new tag to an existing tags array
{
  key: 'tags',
  value: 'important',
  mode: 'push'
}
```

##### Removing from Array (Remove Mode)
```typescript
// Removes a specific tag from the tags array
{
  key: 'tags',
  value: 'obsolete',
  mode: 'remove'
}
```

##### Replacing Array (Set Mode)
```typescript
// Replaces the entire array with a new set of values
{
  key: 'categories',
  value: ['technology', 'innovation'],
  mode: 'set' // This is the default mode, so it can be omitted
}
```

### Real-World Use Cases

#### 1. Auto-populate Related Fields
```typescript
// When user selects a country, auto-populate the currency (but don't overwrite if already set)
action: (event: FormFieldInteractionEvent) => {
  if (event.controlKey === 'country') {
    const currencyMap = {
      'US': 'USD',
      'GB': 'GBP',
      'DE': 'EUR'
    };
    
    return [{
      key: 'currency',
      value: currencyMap[event.value] || 'USD',
      soft: true // Only set if currency field is empty
    }];
  }
  return undefined;
}
```

#### 2. Dynamic Tag Management
```typescript
// Add or remove tags based on category selection
action: (event: FormFieldInteractionEvent) => {
  if (event.controlKey === 'category') {
    const results: ControlActionResult[] = [];
    
    // Remove old category-specific tags
    results.push({
      key: 'tags',
      value: 'tech-category',
      mode: 'remove'
    });
    
    // Add new category-specific tag
    if (event.value === 'technology') {
      results.push({
        key: 'tags',
        value: 'tech-category',
        mode: 'push'
      });
    }
    
    return results;
  }
  return undefined;
}
```

#### 3. Conditional Field Population
```typescript
// Set different default values based on user type
action: (event: FormFieldInteractionEvent) => {
  if (event.controlKey === 'userType') {
    const results: ControlActionResult[] = [];
    
    if (event.value === 'admin') {
      // Set admin-specific defaults
      results.push(
        {
          key: 'permissions',
          value: ['read', 'write', 'admin'],
          mode: 'set'
        },
        {
          key: 'department',
          value: 'IT',
          soft: true // Only if not already set
        }
      );
    } else if (event.value === 'user') {
      // Set user-specific defaults
      results.push({
        key: 'permissions',
        value: ['read'],
        mode: 'set'
      });
    }
    
    return results;
  }
  return undefined;
}
```

#### 4. Complex Array Manipulation
```typescript
// Manage skill requirements based on job position
action: (event: FormFieldInteractionEvent) => {
  if (event.controlKey === 'position') {
    const skillMap = {
      'frontend-developer': ['javascript', 'angular', 'css'],
      'backend-developer': ['nodejs', 'sql', 'api-design'],
      'fullstack-developer': ['javascript', 'angular', 'nodejs', 'sql']
    };
    
    return [{
      key: 'requiredSkills',
      value: skillMap[event.value] || [],
      mode: 'set'
    }];
  }
  
  // Add additional skills based on experience level
  if (event.controlKey === 'experienceLevel') {
    if (event.value === 'senior') {
      return [{
        key: 'requiredSkills',
        value: 'leadership',
        mode: 'push'
      }];
    }
  }
  
  return undefined;
}
```

### Best Practices

1. **Use `soft: true`** when setting default values that shouldn't overwrite user input
2. **Use `mode: 'push'`** when adding items to existing arrays without losing current values
3. **Use `mode: 'remove'`** when you need to remove specific items from arrays
4. **Return `undefined`** from action functions when no changes are needed
5. **Always validate the `event.controlKey`** before applying actions
6. **Consider performance** - actions are triggered on every field interaction

### Integration with ControlOptions

```typescript
const controlOptions: ControlOptions = {
  action: (event: FormFieldInteractionEvent) => {
    // Your action logic here
    return [
      {
        key: 'targetField',
        value: 'newValue',
        soft: true,
        mode: 'set'
      }
    ];
  }
};
```

---

## Number Input Control Options

The following options are available for number input fields (`CONTROL_TYPES.INPUT` with `type: INPUT_TYPES.NUMBER`). These options control numeric input behavior, validation, and display formatting.

### Number Input Buttons

#### `areNumberInputButtonsVisible?: boolean`
Controls whether the increment/decrement buttons (spinners) are visible on number inputs.

**Default:** `true`

**Example:**
```typescript
controlOptions: {
  areNumberInputButtonsVisible: false // Hides the +/- buttons for a cleaner look
}
```

### Number Formatting

#### `useNumberGrouping?: boolean`
Enables or disables grouping separators (thousands separators) for number display.

**Default:** `false`

**Example:**
```typescript
controlOptions: {
  useNumberGrouping: true // Displays 1000000 as 1,000,000
}
```

#### `minFractionDigits?: number`
Sets the minimum number of decimal places to display.

**Example:**
```typescript
controlOptions: {
  minFractionDigits: 2 // Always shows at least 2 decimal places (e.g., 5 displays as 5.00)
}
```

#### `maxFractionDigits?: number`
Sets the maximum number of decimal places to display.

**Example:**
```typescript
controlOptions: {
  maxFractionDigits: 2 // Limits display to 2 decimal places maximum
}
```

### Currency Display

#### `numberCurrency?: string`
Specifies the currency code for currency-formatted number inputs. When set, the number input will automatically display in currency mode.

**Example:**
```typescript
controlOptions: {
  numberCurrency: 'USD', // Displays values as US Dollars ($1,234.56)
  useNumberGrouping: true, // Recommended with currency
  minFractionDigits: 2,
  maxFractionDigits: 2
}
```

**Common Currency Codes:**
- `'USD'` - US Dollar
- `'EUR'` - Euro
- `'GBP'` - British Pound
- `'JPY'` - Japanese Yen
- `'CHF'` - Swiss Franc

### Number Input Constraints

#### `min?: number`
Sets the minimum allowed value for the number input.

**Example:**
```typescript
controlOptions: {
  min: 0 // Cannot enter negative numbers
}
```

**Note:** Should be used with `Validators.min()` for form validation.

#### `max?: number`
Sets the maximum allowed value for the number input.

**Example:**
```typescript
controlOptions: {
  max: 100 // Cannot enter values greater than 100
}
```

**Note:** Should be used with `Validators.max()` for form validation.

#### `step?: number`
Defines the increment/decrement step when using the spinner buttons.

**Example:**
```typescript
controlOptions: {
  step: 0.5 // Values increment by 0.5 (0, 0.5, 1, 1.5, 2...)
}
```

### Complete Number Input Examples

#### Basic Integer Input
```typescript
{
  key: 'quantity',
  controlType: CONTROL_TYPES.INPUT,
  type: INPUT_TYPES.NUMBER,
  label: 'Quantity',
  controlOptions: {
    min: 1,
    max: 999,
    step: 1,
    areNumberInputButtonsVisible: true,
    validators: [Validators.required, Validators.min(1), Validators.max(999)]
  }
}
```

#### Decimal Input with Precision
```typescript
{
  key: 'weight',
  controlType: CONTROL_TYPES.INPUT,
  type: INPUT_TYPES.NUMBER,
  label: 'Weight (kg)',
  controlOptions: {
    min: 0,
    step: 0.1,
    minFractionDigits: 1,
    maxFractionDigits: 2,
    useNumberGrouping: false
  }
}
```

#### Currency Input
```typescript
{
  key: 'price',
  controlType: CONTROL_TYPES.INPUT,
  type: INPUT_TYPES.NUMBER,
  label: 'Price',
  controlOptions: {
    numberCurrency: 'USD',
    min: 0,
    minFractionDigits: 2,
    maxFractionDigits: 2,
    useNumberGrouping: true,
    isClearable: true,
    validators: [Validators.required, Validators.min(0)]
  }
}
```

#### Large Number with Grouping
```typescript
{
  key: 'population',
  controlType: CONTROL_TYPES.INPUT,
  type: INPUT_TYPES.NUMBER,
  label: 'Population',
  controlOptions: {
    min: 0,
    useNumberGrouping: true, // Displays as 1,234,567
    maxFractionDigits: 0, // No decimals
    areNumberInputButtonsVisible: false // No spinner for large numbers
  }
}
```

#### Percentage Input
```typescript
{
  key: 'discountRate',
  controlType: CONTROL_TYPES.INPUT,
  type: INPUT_TYPES.NUMBER,
  label: 'Discount Rate (%)',
  controlOptions: {
    min: 0,
    max: 100,
    step: 5,
    minFractionDigits: 0,
    maxFractionDigits: 2,
    inputIcon: 'pi pi-percentage',
    validators: [Validators.min(0), Validators.max(100)]
  }
}
```

---

## Autocomplete Control Options

The following options are available for autocomplete input fields (`CONTROL_TYPES.AUTOCOMPLETE`). These options control search behavior, performance, and user interaction patterns.

### Search Configuration

#### `searchOptionsFn?: (query: string) => Observable<ExtendedSelectItem[]>`
**Required** function that defines how autocomplete suggestions are fetched. Returns an Observable of options based on the search query.

**Type:** `ControlOnSearchFn`

**Example:**
```typescript
controlOptions: {
  searchOptionsFn: (query: string) => {
    return this.userService.searchUsers(query).pipe(
      map(users => users.map(u => ({
        label: u.name,
        value: u.id,
        extraData: u
      })))
    );
  }
}
```

#### `autocompleteMinQueryLength?: number`
Minimum number of characters required before triggering autocomplete suggestions. Helps reduce unnecessary API calls.

**Example:**
```typescript
controlOptions: {
  autocompleteMinQueryLength: 3, // Suggestions only appear after typing 3+ characters
  searchOptionsFn: (query) => this.searchService.search(query)
}
```

**Use Cases:**
- **Large datasets:** Set to 2-3 to reduce server load
- **Small datasets:** Set to 1 or leave undefined for immediate suggestions
- **Performance optimization:** Higher values mean fewer API calls

#### `autocompleteDelay?: number`
Delay in milliseconds before triggering autocomplete suggestions after user stops typing. Implements debouncing to reduce API calls.

**Example:**
```typescript
controlOptions: {
  autocompleteDelay: 300, // Waits 300ms after user stops typing
  searchOptionsFn: (query) => this.searchService.search(query)
}
```

**Recommended Values:**
- **Fast typing users:** 300-500ms
- **API rate limits:** 500-1000ms
- **Real-time feel:** 100-200ms

### Display Options

#### `autocompleteScrollHeight?: string`
Sets the maximum height of the autocomplete suggestions dropdown. Scrollbar appears when content exceeds this height.

**Default:** `'200px'`

**Example:**
```typescript
controlOptions: {
  autocompleteScrollHeight: '300px' // Shows more options before scrolling
}
```

#### `autocompleteDropdown?: boolean`
Shows a dropdown button that displays all available options when clicked, similar to a select dropdown.

**Default:** `false`

**Example:**
```typescript
controlOptions: {
  autocompleteDropdown: true, // Shows dropdown button for browsing all options
  searchOptionsFn: (query) => this.searchService.search(query)
}
```

**Use Cases:**
- **Hybrid behavior:** Users can search OR browse all options
- **Small option sets:** When users might want to see all choices
- **Discovery:** Helps users explore available options

### Multi-Select

#### `autocompleteMultiple?: boolean`
Enables multiple value selection in the autocomplete control, displaying selected items as chips.

**Default:** `false`

**Example:**
```typescript
controlOptions: {
  autocompleteMultiple: true, // Allows selecting multiple values
  searchOptionsFn: (query) => this.tagService.searchTags(query)
}
```

**Use Cases:**
- **Tags/categories:** Selecting multiple tags or categories
- **Recipients:** Adding multiple email recipients
- **Filters:** Building complex filter criteria

### User Interaction

#### `isCompleteOnFocusDisabled?: boolean`
When true, prevents the suggestions panel from automatically appearing when the input receives focus.

**Default:** `false`

**Example:**
```typescript
controlOptions: {
  isCompleteOnFocusDisabled: true, // Suggestions only show when typing
  searchOptionsFn: (query) => this.searchService.search(query)
}
```

**Use Cases:**
- **Performance:** Avoid initial API calls on focus
- **Clean UI:** Only show suggestions when actively searching
- **Large datasets:** Prevent loading all options on focus

#### `isOptionCreationEnabled?: boolean`
Allows users to create and select a new option when no matching results are found. The typed value becomes the selected value.

**Default:** `false`

**Example:**
```typescript
controlOptions: {
  isOptionCreationEnabled: true, // Users can type custom values
  searchOptionsFn: (query) => this.searchService.search(query)
}
```

**Use Cases:**
- **Free-form input with suggestions:** Email addresses, URLs
- **Dynamic lists:** Adding new tags or categories
- **Flexible data entry:** When predefined options aren't exhaustive

### Complete Autocomplete Examples

#### Basic User Search
```typescript
{
  key: 'assignedUser',
  controlType: CONTROL_TYPES.AUTOCOMPLETE,
  label: 'Assign to User',
  controlOptions: {
    placeholder: 'Search users...',
    searchOptionsFn: (query) => this.userService.searchUsers(query),
    autocompleteMinQueryLength: 2,
    autocompleteDelay: 300,
    isClearable: true,
    validators: [Validators.required]
  }
}
```

#### Multi-Select Tags with Creation
```typescript
{
  key: 'tags',
  controlType: CONTROL_TYPES.AUTOCOMPLETE,
  label: 'Tags',
  controlOptions: {
    placeholder: 'Add tags...',
    searchOptionsFn: (query) => this.tagService.searchTags(query),
    autocompleteMultiple: true,
    isOptionCreationEnabled: true, // Allow custom tags
    autocompleteMinQueryLength: 1,
    autocompleteDelay: 200,
    isClearable: true
  }
}
```

#### Country Selector with Dropdown
```typescript
{
  key: 'country',
  controlType: CONTROL_TYPES.AUTOCOMPLETE,
  label: 'Country',
  controlOptions: {
    placeholder: 'Select or search country...',
    searchOptionsFn: (query) => this.countryService.searchCountries(query),
    autocompleteDropdown: true, // Show all options button
    autocompleteScrollHeight: '250px',
    autocompleteMinQueryLength: 2,
    isCompleteOnFocusDisabled: false, // Show suggestions on focus
    inputIcon: 'pi pi-globe',
    validators: [Validators.required]
  }
}
```

#### Performance-Optimized Search
```typescript
{
  key: 'product',
  controlType: CONTROL_TYPES.AUTOCOMPLETE,
  label: 'Search Products',
  controlOptions: {
    placeholder: 'Type at least 3 characters...',
    searchOptionsFn: (query) => this.productService.searchProducts(query),
    autocompleteMinQueryLength: 3, // Reduce API load
    autocompleteDelay: 500, // Longer debounce
    autocompleteScrollHeight: '300px',
    isCompleteOnFocusDisabled: true, // No initial load
    helpText: 'Start typing to search from thousands of products'
  }
}
```

#### Email Recipients (Multiple with Free Input)
```typescript
{
  key: 'recipients',
  controlType: CONTROL_TYPES.AUTOCOMPLETE,
  label: 'To',
  controlOptions: {
    placeholder: 'Add recipients...',
    searchOptionsFn: (query) => this.contactService.searchContacts(query),
    autocompleteMultiple: true,
    isOptionCreationEnabled: true, // Allow typing email addresses
    autocompleteMinQueryLength: 1,
    autocompleteDelay: 300,
    isClearable: true,
    inputIcon: 'pi pi-users',
    validators: [Validators.required]
  }
}
```

### Best Practices

1. **Always implement debouncing** with `autocompleteDelay` to avoid excessive API calls
2. **Use `autocompleteMinQueryLength`** for large datasets to reduce server load
3. **Set appropriate `autocompleteScrollHeight`** based on typical result counts
4. **Consider `isCompleteOnFocusDisabled: true`** for performance-critical searches
5. **Enable `isOptionCreationEnabled`** when user input might not match existing options
6. **Use `autocompleteMultiple`** for tags, categories, or any multi-selection scenario
7. **Add `autocompleteDropdown`** when users benefit from browsing all options
8. **Handle loading states** in your `searchOptionsFn` implementation
9. **Return consistent data structures** with label, value, and optional extraData
10. **Test with slow networks** to ensure `autocompleteDelay` provides good UX

---

## General Control Options

These options are available for most or all control types.

### Field Clearing

#### `isClearable?: boolean`
Enables or disables the clear button/icon for the control, allowing users to quickly reset the field value.

**Default:** `true`

**Applicable to:** Number inputs, radio buttons, dropdowns, autocomplete, multi-select

**Example:**
```typescript
controlOptions: {
  isClearable: false // Removes the clear icon, forcing users to manually delete/deselect
}
```

**Use Cases:**
- **Disable for required fields** where clearing might be confusing
- **Disable for critical fields** to prevent accidental data loss
- **Enable for optional fields** to provide easy reset functionality

**Field-Specific Behavior:**
- **Radio buttons:** Shows an 'X' icon next to the selected option
- **Dropdowns/Select:** Shows a clear icon in the control
- **Multi-select:** Shows a clear icon (only when not required)
- **Autocomplete:** Shows a clear icon to reset the selection
- **Number inputs:** Shows a clear icon to reset the value

**Example with Required Field:**
```typescript
{
  key: 'status',
  controlType: CONTROL_TYPES.SELECT,
  label: 'Status',
  controlOptions: {
    isClearable: false, // No clear button on required status field
    validators: [Validators.required]
  }
}
```

**Example with Radio Group:**
```typescript
{
  key: 'preference',
  controlType: CONTROL_TYPES.RADIO,
  label: 'Communication Preference',
  options: [
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'SMS', value: 'sms' }
  ],
  controlOptions: {
    isClearable: true, // Shows X icon to deselect radio option
    radioOptionsDirection: 'row'
  }
}
```

---

## Date Control Options

The following options are available for date input fields (`CONTROL_TYPES.DATE`). These options provide extensive customization for date and time selection functionality.

### Basic Date Configuration

#### `dateSelectionMode?: "single" | "multiple" | "range"`
Defines how dates can be selected in the date picker.
- `"single"`: Select one date at a time (default)
- `"multiple"`: Select multiple individual dates
- `"range"`: Select a date range (start and end date)

**Example:**
```typescript
controlOptions: {
  dateSelectionMode: 'range' // Allows selecting a date range
}
```

#### `dateShowTime?: boolean`
Enables time selection in addition to date selection. Only available when `dateSelectionMode` is `"single"`.

**Example:**
```typescript
controlOptions: {
  dateSelectionMode: 'single',
  dateShowTime: true // Shows time picker with hours and minutes
}
```

#### `dateFormat?: string`
Specifies the date format string for displaying dates in the control.

**Default:** `'yy-mm-dd'`

**Example:**
```typescript
controlOptions: {
  dateFormat: 'dd/mm/yy' // Displays dates as 31/12/2023
}
```

### Date Restrictions

#### `dateMin?: Date`
Sets the minimum selectable date in the date picker. Users cannot select dates before this value.

**Example:**
```typescript
controlOptions: {
  dateMin: new Date(2020, 0, 1) // Users cannot select dates before January 1, 2020
}
```

#### `dateMax?: Date`
Sets the maximum selectable date in the date picker. Users cannot select dates after this value.

**Example:**
```typescript
controlOptions: {
  dateMax: new Date(2025, 11, 31) // Users cannot select dates after December 31, 2025
}
```

#### `dateDisabledDates?: Date[]`
Array of specific dates that should be disabled (not selectable) in the date picker.

**Example:**
```typescript
controlOptions: {
  dateDisabledDates: [
    new Date(2023, 0, 1),  // January 1, 2023
    new Date(2023, 11, 25) // December 25, 2023
  ] // Disables New Year's Day and Christmas
}
```

#### `dateDisabledDays?: number[]`
Array of weekday numbers that should be disabled in the date picker.
- `0` = Sunday
- `1` = Monday
- `2` = Tuesday
- `3` = Wednesday
- `4` = Thursday
- `5` = Friday
- `6` = Saturday

**Example:**
```typescript
controlOptions: {
  dateDisabledDays: [0, 6] // Disables all Sundays and Saturdays (weekends)
}
```

### Overlay Configuration

#### `dateOverlayWidth?: string`
Sets the width of the date picker overlay panel.

**Default:** `'500px'`

**Example:**
```typescript
controlOptions: {
  dateOverlayWidth: '400px' // Sets overlay width to 400 pixels
}
```

#### `dateNumberOfMonths?: number`
Specifies the number of months to display simultaneously in the date picker overlay.

**Default:** `1`

**Example:**
```typescript
controlOptions: {
  dateNumberOfMonths: 2 // Shows two months side by side
}
```

#### `dateHideOverlayOnSelect?: boolean`
Determines whether the date picker overlay should automatically close after selecting a date.

**Default:** `false`

**Example:**
```typescript
controlOptions: {
  dateHideOverlayOnSelect: true // Closes overlay automatically after date selection
}
```

### Input Behavior

#### `dateReadonlyInput?: boolean`
When enabled, prevents manual typing in the date input field. Users can only select dates via the picker.

**Default:** `false`

**Example:**
```typescript
controlOptions: {
  dateReadonlyInput: true // Users must use the date picker, cannot type manually
}
```

#### `dateMaxCount?: number`
Maximum number of dates that can be selected when `dateSelectionMode` is set to `"multiple"`.

**Example:**
```typescript
controlOptions: {
  dateSelectionMode: 'multiple',
  dateMaxCount: 3 // Limits selection to maximum 3 dates
}
```

### Time Configuration

#### `dateShowSeconds?: boolean`
Shows seconds selector in addition to hours and minutes when time selection is enabled.

**Example:**
```typescript
controlOptions: {
  dateShowTime: true,
  dateShowSeconds: true // Displays hours:minutes:seconds
}
```

#### `dateTimeOnly?: boolean`
When enabled, displays only the time picker without date selection.

**Example:**
```typescript
controlOptions: {
  dateTimeOnly: true // Shows only time picker (no date)
}
```

#### `dateStepHours?: number`
Sets the increment step for hours in the time selection.

**Example:**
```typescript
controlOptions: {
  dateShowTime: true,
  dateStepHours: 2 // Hours increment by 2 (0, 2, 4, 6, ...)
}
```

#### `dateStepMinutes?: number`
Sets the increment step for minutes in the time selection.

**Example:**
```typescript
controlOptions: {
  dateShowTime: true,
  dateStepMinutes: 15 // Minutes increment by 15 (0, 15, 30, 45)
}
```

### View Configuration

#### `dateViewMode?: "date" | "month" | "year"`
Sets the initial view mode when the date picker opens.

**Default:** `"date"`

**Example:**
```typescript
controlOptions: {
  dateViewMode: 'year' // Opens calendar in year selection mode
}
```

### Complete Examples

#### Basic Date Field
```typescript
{
  key: 'birthDate',
  controlType: CONTROL_TYPES.DATE,
  label: 'Date of Birth',
  controlOptions: {
    dateFormat: 'dd/mm/yy',
    dateMax: new Date(), // Cannot select future dates
    dateViewMode: 'year' // Start with year selection for easier navigation
  }
}
```

#### Date Range Selector
```typescript
{
  key: 'vacationPeriod',
  controlType: CONTROL_TYPES.DATE,
  label: 'Vacation Period',
  controlOptions: {
    dateSelectionMode: 'range',
    dateMin: new Date(), // Cannot select past dates
    dateDisabledDays: [0, 6], // No weekends
    dateNumberOfMonths: 2, // Show 2 months for easier range selection
    dateReadonlyInput: true // Force use of picker
  }
}
```

#### Appointment Scheduler
```typescript
{
  key: 'appointmentDateTime',
  controlType: CONTROL_TYPES.DATE,
  label: 'Appointment Date & Time',
  controlOptions: {
    dateShowTime: true,
    dateStepMinutes: 30, // 30-minute slots
    dateDisabledDays: [0], // No Sundays
    dateMin: new Date(), // Cannot book in the past
    dateMax: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Max 90 days ahead
    dateHideOverlayOnSelect: true,
    dateReadonlyInput: true
  }
}
```

#### Time-Only Selector
```typescript
{
  key: 'workStartTime',
  controlType: CONTROL_TYPES.DATE,
  label: 'Start Time',
  controlOptions: {
    dateTimeOnly: true,
    dateStepMinutes: 15,
    dateShowSeconds: false,
    dateFormat: 'HH:mm'
  }
}
```

#### Multi-Date Selector
```typescript
{
  key: 'availableDates',
  controlType: CONTROL_TYPES.DATE,
  label: 'Select Your Available Dates',
  controlOptions: {
    dateSelectionMode: 'multiple',
    dateMaxCount: 5, // Maximum 5 dates
    dateDisabledDays: [0, 6], // No weekends
    dateNumberOfMonths: 2,
    dateOverlayWidth: '600px'
  }
}
```

---

## Rich Text Editor (WYSIWYG) Control Options

The following options are available for rich text editor fields (`CONTROL_TYPES.WYSIWYG`). These options control the appearance and behavior of the WYSIWYG editor.

### Editor Height

#### `textEditorHeight?: string`
Sets the height of the rich text editor content area. This determines how much vertical space the editor occupies.

**Default:** `'200px'`

**Example:**
```typescript
controlOptions: {
  textEditorHeight: '300px' // Sets the editor height to 300 pixels
}
```

**Common Values:**
- `'200px'` - Compact editor for short text
- `'300px'` - Standard editor for medium content
- `'400px'` - Large editor for longer content
- `'500px'` - Extra large editor for extensive content

**Use Cases:**
- **Short descriptions:** Use 200-250px for brief text entries
- **Standard content:** Use 300-400px for typical rich text content
- **Long articles:** Use 400px+ for blog posts or detailed documentation
- **Forms:** Match the height to the expected content length

**Example with Different Heights:**
```typescript
{
  key: 'summary',
  controlType: CONTROL_TYPES.WYSIWYG,
  label: 'Summary',
  controlOptions: {
    textEditorHeight: '150px', // Compact for summary
    validators: [Validators.required]
  }
}
```

```typescript
{
  key: 'articleContent',
  controlType: CONTROL_TYPES.WYSIWYG,
  label: 'Article Content',
  controlOptions: {
    textEditorHeight: '500px', // Large for article content
    validators: [Validators.required]
  }
}
```

### HTML Toggle

#### `isHtmlToggleable?: boolean`
Enables or disables the HTML view toggle button, allowing users to switch between visual editing and raw HTML editing modes.

**Default:** `false`

**Example:**
```typescript
controlOptions: {
  isHtmlToggleable: true // Shows the HTML toggle button
}
```

**Use Cases:**
- **Enable for advanced users:** When users need direct HTML editing capabilities
- **Enable for debugging:** To inspect or fix HTML structure issues
- **Disable for basic users:** To prevent confusion or accidental HTML errors
- **Enable for developers:** When precise HTML control is needed

**Security Considerations:**
- When enabled, users can insert custom HTML, CSS, and potentially scripts
- Consider implementing server-side HTML sanitization
- Only enable for trusted users who understand HTML

**Example - Advanced Editor:**
```typescript
{
  key: 'emailTemplate',
  controlType: CONTROL_TYPES.WYSIWYG,
  label: 'Email Template',
  controlOptions: {
    textEditorHeight: '400px',
    isHtmlToggleable: true, // Allow HTML editing for templates
    helpText: 'Use the HTML button to access advanced formatting options'
  }
}
```

**Example - Basic Editor:**
```typescript
{
  key: 'userComment',
  controlType: CONTROL_TYPES.WYSIWYG,
  label: 'Comment',
  controlOptions: {
    textEditorHeight: '200px',
    isHtmlToggleable: false, // Disable HTML editing for regular users
    validators: [Validators.required]
  }
}
```

### Complete Rich Text Editor Examples

#### Standard Content Editor
```typescript
{
  key: 'description',
  controlType: CONTROL_TYPES.WYSIWYG,
  label: 'Description',
  controlOptions: {
    textEditorHeight: '300px',
    isHtmlToggleable: false,
    helpText: 'Provide a detailed description with formatting',
    validators: [Validators.required]
  }
}
```

#### Advanced HTML Editor
```typescript
{
  key: 'customHtmlContent',
  controlType: CONTROL_TYPES.WYSIWYG,
  label: 'Custom HTML Content',
  controlOptions: {
    textEditorHeight: '500px',
    isHtmlToggleable: true,
    helpText: 'Click the HTML button to edit raw HTML',
    tooltipLabel: 'Advanced HTML editing available'
  }
}
```

#### Compact Editor
```typescript
{
  key: 'shortNote',
  controlType: CONTROL_TYPES.WYSIWYG,
  label: 'Quick Note',
  controlOptions: {
    textEditorHeight: '150px',
    isHtmlToggleable: false,
    placeholder: 'Add a quick note...'
  }
}
```

#### Email Template Editor
```typescript
{
  key: 'emailBody',
  controlType: CONTROL_TYPES.WYSIWYG,
  label: 'Email Body',
  controlOptions: {
    textEditorHeight: '450px',
    isHtmlToggleable: true, // Allow HTML for email customization
    helpText: 'Design your email template with rich formatting',
    validators: [Validators.required]
  }
}
```

### Best Practices

1. **Choose appropriate height** based on expected content length
2. **Enable HTML toggle only for trusted users** to prevent security issues
3. **Provide clear help text** when HTML toggle is enabled
4. **Consider mobile responsiveness** when setting editor height
5. **Use validation** to ensure required content is provided
6. **Implement server-side sanitization** when HTML toggle is enabled
7. **Test with various content lengths** to ensure height is sufficient
8. **Avoid too small heights** (< 150px) as it impacts usability
9. **Consider user expertise** when deciding to enable HTML toggle
10. **Provide tooltips** to guide users on HTML editing features
