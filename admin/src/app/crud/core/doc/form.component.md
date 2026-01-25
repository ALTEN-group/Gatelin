# FormComponent Documentation

## Overview
A dynamic form component that generates reactive forms based on configuration objects. Supports conditional logic, validation, and various field types with automatic form generation and validation.

## Inputs

### Core Configuration

#### `config` (required, model)
**Type:** `CrudItemOptions[]`  
**Description:** Configuration array that defines the structure and behavior of form fields.

```typescript
config: [
  {
    key: 'name',
    label: 'Full Name',
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
        validators: [required],
    }
  },
  {
    key: 'age',
    label: 'Age',
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.NUMBER,
  },
  // ...
]
```

#### `model` (required, model)
**Type:** `any`  
**Description:** Two-way binding for form values. Contains the current state of all form fields.

```typescript
// Initial form values
model = {
  name: '',
  email: '',
  age: null,
  preferences: {
    newsletter: true,
    theme: 'light'
  }
}
```

### Display Options

#### `columnsCount`
**Type:** `1 | 2 | 3` | **Default:** `1`  
**Description:** Defines the number of columns for form layout.

```typescript
// Single column layout (full width)
columnsCount: 1

// Two column layout (50% width each)
columnsCount: 2

// Three column layout (33.33% width each)
columnsCount: 3
```

#### `showSubmit`
**Type:** `boolean` | **Default:** `false`  
**Description:** Shows/hides the submit button.

```typescript
// Show submit button
<frm-form [showSubmit]="true" (submitted)="onSubmit($event)" />

// Hide submit button (custom submission handling)
<frm-form [showSubmit]="false" />
```

#### `showReset`
**Type:** `boolean` | **Default:** `false`  
**Description:** Shows/hides the reset button.

```typescript
// Show reset button
<frm-form [showReset]="true" (reset)="onReset()" />
```

#### `showDebug`
**Type:** `boolean` | **Default:** `false`  
**Description:** Shows debug information including form values and validation state.

```typescript
// Enable debug mode during development
<frm-form [showDebug]="true" />
```

### Form Behavior

#### `isReadonly`
**Type:** `boolean` | **Default:** `false`  
**Description:** Makes the entire form read-only.

```typescript
// Editable form
<frm-form [isReadonly]="false" />

// Read-only form (view mode)
<frm-form [isReadonly]="true" />

// Conditional readonly based on user permissions
<frm-form [isReadonly]="!canEdit" />
```

#### `groupValidator`
**Type:** `ValidatorFn | undefined`  
**Description:** Custom validator applied to the entire form group.

```typescript
// Cross-field validation
groupValidator: (group: AbstractControl) => {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;
  
  if (start && end && start > end) {
    return { dateRange: 'Start date must be before end date' };
  }
  
  return null;
}

// Password confirmation validation
groupValidator: (group: AbstractControl) => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  
  return password === confirm ? null : { passwordMismatch: true };
}
```

### Form Control

#### `forceReload`
**Type:** `number` | **Default:** `0`  
**Description:** Trigger to force form recreation. Increment to reload.

```typescript
// Force form reload
reloadForm() {
  this.forceReloadTrigger.set(Date.now());
}

// In template
<frm-form [forceReload]="forceReloadTrigger" />
```

#### `forceReloadValues`
**Type:** `number` | **Default:** `0`  
**Description:** Trigger to force form values reload without recreating the form.

```typescript
// Reload only values
reloadValues() {
  this.forceReloadValuesTrigger.set(Date.now());
}
```

### Button Customization

#### `submitButtonLabel`
**Type:** `string` | **Default:** `"Valider"`  
**Description:** Custom label for the submit button.

```typescript
// Custom submit button text
submitButtonLabel: "Save Changes"

// Localized labels
submitButtonLabel: $localize`:@@form.save:Save`
```

#### `resetButtonLabel`
**Type:** `string` | **Default:** `"Réinitialiser"`  
**Description:** Custom label for the reset button.

```typescript
// Custom reset button text
resetButtonLabel: "Clear Form"
```

### Label Display Options

#### `labelStrategy`
**Type:** `'normal' | 'float' | 'ifta'` | **Default:** `'ifta'`  
**Description:** Defines how field labels are displayed across the form.

```typescript
// Standard label above field
labelStrategy: 'normal'

// Floating label animation
labelStrategy: 'float'

// IFTA (International Financial Technical Association) style label
labelStrategy: 'ifta'
```

**Label Strategies:**

- **`normal`**: Traditional label positioned above the input field
- **`float`**: Label starts inside the field and floats above when focused or filled
- **`ifta`**: Labels stays inside the input container

```typescript
// Example usage with different label types
<frm-form
  [(model)]="formData"
  [config]="formConfig"
  labelStrategy="float"
  [showSubmit]="true">
</frm-form>

// Mixed with form configuration
component.ts:
labelType: 'ifta' = 'ifta';

template:
<frm-form
  [(model)]="userForm"
  [config]="userConfig"
  [labelStrategy]="labelType">
</frm-form>
```

## Outputs

- `modelChange: any` - Emitted when form values change (two-way binding)
- `validityChange: boolean` - Emitted when form validation state changes
- `fieldInteraction: FormFieldInteractionEvent` - Emitted when user interacts with form fields
- `submitted: any` - Emitted when form is submitted (if showSubmit is true)
- `reset: void` - Emitted when form is reset (if showReset is true)

## Control Types

### File Upload Controls

File upload controls allow users to upload and manage files. Use `CONTROL_TYPES.FILES` for file handling.

```typescript
config: [
  {
    key: 'documents',
    label: 'Documents',
    controlType: CONTROL_TYPES.FILES,
    controlOptions: {
      multiple: true,
      maxFileSize: 8000000, // 8MB
      mediaType: 'document',
      isPreviewEnabled: false,
      filesPathResolver: (model) => `${environment.apiGateway}/files/${model.uuid}`
    }
  },
  {
    key: 'portrait',
    label: 'Profile Picture',
    controlType: CONTROL_TYPES.FILES,
    controlOptions: {
      multiple: false,
      maxFileSize: 5000000, // 5MB
      mediaType: 'image',
      isPreviewEnabled: true,
      filesPathResolver: (model) => `${environment.apiGateway}/users/${model.id}/portrait`
    }
  }
]
```

#### File Control Options

- **`multiple`**: Allow multiple file selection
- **`maxFileSize`**: Maximum file size in bytes
- **`mediaType`**: `'image'` for images or `'document'` for documents
- **`isPreviewEnabled`**: Enable file preview functionality
- **`filesPathResolver`**: Function to resolve file paths from model data for display and download

### Number Input Controls

Number input controls allow users to enter numeric values with validation and formatting options. Use `CONTROL_TYPES.NUMBER` for number fields.

```typescript
config: [
  {
    key: 'price',
    label: 'Price',
    controlType: CONTROL_TYPES.NUMBER,
    controlOptions: {
      placeholder: 'Enter price',
      min: 0,
      max: 10000,
      step: 0.01,
      minFractionDigits: 2,
      maxFractionDigits: 2,
      validators: [Validators.required]
    }
  },
  {
    key: 'quantity',
    label: 'Quantity',
    controlType: CONTROL_TYPES.NUMBER,
    controlOptions: {
      min: 1,
      max: 999,
      step: 1,
    }
  },
  {
    key: 'percentage',
    label: 'Discount %',
    controlType: CONTROL_TYPES.NUMBER,
    controlOptions: {
      min: 0,
      max: 100,
      step: 5,
    }
  }
]
```

#### Number Control Options

- **`placeholder`**: Placeholder text displayed when the field is empty
- **`min`**: Minimum allowed value
- **`max`**: Maximum allowed value
- **`step`**: Increment/decrement step when using arrow buttons (e.g., `1`, `0.1`, `5`)
- **`minFractionDigits`**: Minimum number of decimal places to display (e.g., `2` for currency)
- **`maxFractionDigits`**: Maximum number of decimal places to display (e.g., `2` for currency)

#### Examples

##### Basic Integer Input
```typescript
{
  key: 'age',
  label: 'Age',
  controlType: CONTROL_TYPES.NUMBER,
  controlOptions: {
    min: 0,
    max: 120,
    step: 1
  }
}
```

##### Currency Input
```typescript
{
  key: 'salary',
  label: 'Annual Salary',
  controlType: CONTROL_TYPES.NUMBER,
  controlOptions: {
    mode: 'currency',
    currency: 'USD',
    minFractionDigits: 2,
    maxFractionDigits: 2,
    min: 0
  }
}
```

##### Percentage Input
```typescript
{
  key: 'taxRate',
  label: 'Tax Rate',
  controlType: CONTROL_TYPES.NUMBER,
  controlOptions: {
    min: 0,
    max: 100,
    step: 0.5,
    minFractionDigits: 2,
    maxFractionDigits: 2,
    suffix: '%'
  }
}
```

##### Weight Input with Buttons
```typescript
{
  key: 'weight',
  label: 'Weight',
  controlType: CONTROL_TYPES.NUMBER,
  controlOptions: {
    min: 0,
    step: 0.1,
    minFractionDigits: 1,
    maxFractionDigits: 1,
    suffix: ' kg',
    showButtons: true
  }
}
```

### Input Icons

Form fields that support visual enhancement can display icons to improve user experience and provide visual context. Use the `inputIcon` property in field configuration.

```typescript
config: [
  {
    key: 'email',
    label: 'Email Address',
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      inputIcon: 'mail',
      validators: [Validators.required, Validators.email]
    }
  },
]
```

### Select Button Controls

Select button controls display options as clickable buttons instead of dropdown menus. Use `CONTROL_TYPES.RADIO` for single selection or configure for multiple selections.

```typescript
config: [
  {
    key: 'priority',
    label: 'Priority Level',
    controlType: CONTROL_TYPES.RADIO,
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
      { label: 'Critical', value: 'critical' }
    ],
    controlOptions: {
      // Enable multiple selection for button controls
      multipleSelectButton: true,
      // Allow deselecting already selected options
      isSelectButtonOptionToggleable: true
    }
  },
  {
    key: 'features',
    label: 'Features',
    controlType: CONTROL_TYPES.RADIO,
    options: [
      { label: 'Basic', value: 'basic' },
      { label: 'Premium', value: 'premium' },
      { label: 'Enterprise', value: 'enterprise' }
    ],
    controlOptions: {
      // Single selection with toggle capability
      isSelectButtonOptionToggleable: true
    }
  }
]
```

#### Select Button Control Options

- **`multipleSelectButton`**: Enables multiple selection for select button controls - allows selecting multiple options simultaneously
- **`isSelectButtonOptionToggleable`**: Allows deselecting/toggling select button options - enables clicking to unselect a previously selected option

### Table Control

Table controls allow users to manage tabular data within a form, providing inline editing capabilities, filtering, sorting, and the ability to add or delete rows. Use `CONTROL_TYPES.TABLE` for tabular data management.

```typescript
config: [
  {
    key: 'workExperience',
    label: 'Work Experience',
    controlType: CONTROL_TYPES.TABLE,
    controlOptions: {
      width: '100%',
      validators: [Validators.required],
      tableCtrlConfig: {
        editionMode: 'cell',
        filterable: true,
        sortable: true,
        selectable: true,
        isCreationEnabled: true,
        isDeletionEnabled: true,
        isHeaderHidden: false
      },
      tableCtrlColumns: [
        {
          key: 'company',
          label: 'Company',
          controlType: CONTROL_TYPES.INPUT,
          type: INPUT_TYPES.TEXT,
          controlOptions: {
            validators: [Validators.required]
          }
        },
        {
          key: 'position',
          label: 'Position',
          controlType: CONTROL_TYPES.INPUT,
          type: INPUT_TYPES.TEXT,
          controlOptions: {
            validators: [Validators.required]
          }
        },
        {
          key: 'skills',
          label: 'Skills',
          controlType: CONTROL_TYPES.MULTISELECT,
          options: [
            { label: 'JavaScript', value: 'js' },
            { label: 'TypeScript', value: 'ts' },
            { label: 'Angular', value: 'angular' }
          ]
        },
        {
          key: 'startDate',
          label: 'Start Date',
          controlType: CONTROL_TYPES.DATE,
          type: INPUT_TYPES.DATE
        }
      ]
    }
  }
]
```

#### Table Control Configuration Options

The `tableCtrlConfig` property accepts the following options:

##### `editionMode`
**Type:** `'cell' | 'row'` | **Default:** `'cell'`  
**Description:** Defines how users edit table data:
- `'cell'`: Enables inline editing directly within individual cells (supports INPUT, SELECT, and MULTISELECT only)
- `'row'`: Enables row-level editing with edit/save/cancel buttons for each row

```typescript
tableCtrlConfig: {
  editionMode: 'cell' // Quick inline editing
}
```

##### `filterable`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables filtering capabilities for table columns. When enabled, filter inputs appear in the table header.

```typescript
tableCtrlConfig: {
  filterable: true
}
```

##### `sortable`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables sorting for table columns. Users can click column headers to sort data.

```typescript
tableCtrlConfig: {
  sortable: true
}
```

##### `selectable`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables row selection with checkboxes. Selected rows can be used with bulk operations.

```typescript
tableCtrlConfig: {
  selectable: true
}
```

##### `isCreationEnabled`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables the "Add Row" button above the table, allowing users to add new empty rows to the table.

```typescript
tableCtrlConfig: {
  isCreationEnabled: true // Shows "Add Row" button
}
```

##### `isDeletionEnabled`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables delete buttons for each row, allowing users to remove individual rows from the table. When enabled, a delete button (trash icon) appears in the Actions column for each row.

```typescript
tableCtrlConfig: {
  isDeletionEnabled: true // Shows delete button for each row
}
```

##### `isHeaderHidden`
**Type:** `boolean` | **Default:** `false`  
**Description:** Hides the table header row containing column labels.

```typescript
tableCtrlConfig: {
  isHeaderHidden: false // Show column headers
}
```

##### `sortedColumnKeys`
**Type:** `string[]` | **Default:** `[]`  
**Description:** Array of column keys defining the display order of columns.

```typescript
tableCtrlConfig: {
  sortedColumnKeys: ['position', 'company', 'startDate', 'skills']
}
```

##### `onCellClicked`
**Type:** `(entry: { row: unknown; index: number; mode: 'read' | 'write' }) => unknown`  
**Description:** Callback function triggered when a table cell is clicked.

```typescript
tableCtrlConfig: {
  onCellClicked: (entry) => {
    console.log('Clicked row:', entry.row, 'at index:', entry.index);
  }
}
```

##### `groupValidator`
**Type:** `ValidatorFn`  
**Description:** Custom validator function applied to the entire row when editing in row mode.

```typescript
tableCtrlConfig: {
  groupValidator: (group: AbstractControl) => {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    return start && end && start > end ? { invalidDateRange: true } : null;
  }
}
```

#### Table Column Configuration

The `tableCtrlColumns` property defines the structure of table columns. Each column follows the standard `CrudItemOptions` format:

```typescript
tableCtrlColumns: [
  {
    key: 'fieldName',
    label: 'Display Label',
    controlType: CONTROL_TYPES.INPUT, // or SELECT, MULTISELECT, DATE, etc.
    type: INPUT_TYPES.TEXT, // For INPUT controls
    options: [], // For SELECT and MULTISELECT controls
    controlOptions: {
      validators: [Validators.required],
      placeholder: 'Enter value...',
      isCellEditionDisabled: false // Disable editing for specific column
    }
  }
]
```

**Note:** Cell edition is currently only supported for `INPUT`, `SELECT`, and `MULTISELECT` control types in cell edition mode.

#### Events and Interactions

The table control emits various events through the `fieldInteraction` output:

- **`rowAdded`**: Emitted when a new row is added via the "Add Row" button
- **`rowDeleted`**: Emitted when a row is deleted via the delete button
- **`cellClicked`**: Emitted when a cell is clicked
- **`cellEditInit`**: Emitted when cell editing begins
- **`cellEditComplete`**: Emitted when cell editing completes
- **`rowEditInit`**: Emitted when row editing begins (row mode)
- **`rowEditComplete`**: Emitted when row editing completes (row mode)
- **`rowEditCancel`**: Emitted when row editing is cancelled (row mode)
- **`rowsSelectionChange`**: Emitted when row selection changes

```typescript
<frm-form
  [(model)]="formData"
  [config]="formConfig"
  (fieldInteraction)="onTableInteraction($event)">
</frm-form>

onTableInteraction(event: FormFieldInteractionEvent) {
  if (event.controlKey === 'workExperience') {
    switch (event.interactionType) {
      case 'rowAdded':
        console.log('New row added:', event.data);
        break;
      case 'rowDeleted':
        console.log('Row deleted:', event.data);
        break;
      case 'cellEditComplete':
        console.log('Cell edited:', event.data);
        break;
    }
  }
}
```

#### Complete Table Control Examples

##### Basic Editable Table
```typescript
{
  key: 'items',
  label: 'Items',
  controlType: CONTROL_TYPES.TABLE,
  controlOptions: {
    tableCtrlConfig: {
      editionMode: 'cell',
      isCreationEnabled: true,
      isDeletionEnabled: true
    },
    tableCtrlColumns: [
      {
        key: 'name',
        label: 'Item Name',
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          validators: [Validators.required]
        }
      },
      {
        key: 'quantity',
        label: 'Quantity',
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.NUMBER,
        controlOptions: {
          validators: [Validators.required, Validators.min(1)]
        }
      }
    ]
  }
}
```

##### Advanced Table with All Features
```typescript
{
  key: 'employees',
  label: 'Employees',
  controlType: CONTROL_TYPES.TABLE,
  controlOptions: {
    width: '100%',
    validators: [Validators.required],
    tableCtrlConfig: {
      editionMode: 'row',
      filterable: true,
      sortable: true,
      selectable: true,
      isCreationEnabled: true,
      isDeletionEnabled: true,
      isHeaderHidden: false,
      sortedColumnKeys: ['name', 'department', 'role', 'hireDate'],
      onCellClicked: (entry) => {
        console.log('Employee clicked:', entry.row);
      }
    },
    tableCtrlColumns: [
      {
        key: 'name',
        label: 'Full Name',
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          validators: [Validators.required],
          placeholder: 'Enter full name'
        }
      },
      {
        key: 'department',
        label: 'Department',
        controlType: CONTROL_TYPES.SELECT,
        options: [
          { label: 'Engineering', value: 'eng' },
          { label: 'Sales', value: 'sales' },
          { label: 'HR', value: 'hr' }
        ],
        controlOptions: {
          validators: [Validators.required]
        }
      },
      {
        key: 'role',
        label: 'Role',
        controlType: CONTROL_TYPES.SELECT,
        options: [
          { label: 'Junior', value: 'junior' },
          { label: 'Senior', value: 'senior' },
          { label: 'Lead', value: 'lead' }
        ]
      },
      {
        key: 'skills',
        label: 'Skills',
        controlType: CONTROL_TYPES.MULTISELECT,
        options: [
          { label: 'JavaScript', value: 'js' },
          { label: 'TypeScript', value: 'ts' },
          { label: 'Angular', value: 'angular' },
          { label: 'React', value: 'react' }
        ]
      },
      {
        key: 'hireDate',
        label: 'Hire Date',
        controlType: CONTROL_TYPES.DATE,
        type: INPUT_TYPES.DATE
      }
    ]
  }
}
```

##### Read-Only Table
```typescript
{
  key: 'orderHistory',
  label: 'Order History',
  controlType: CONTROL_TYPES.TABLE,
  controlOptions: {
    disabled: true, // Makes entire table read-only
    tableCtrlConfig: {
      editionMode: 'cell',
      filterable: true,
      sortable: true,
      isCreationEnabled: false,
      isDeletionEnabled: false
    },
    tableCtrlColumns: [
      {
        key: 'orderNumber',
        label: 'Order #',
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          isCellEditionDisabled: true
        }
      },
      {
        key: 'date',
        label: 'Date',
        controlType: CONTROL_TYPES.DATE
      },
      {
        key: 'status',
        label: 'Status',
        controlType: CONTROL_TYPES.SELECT,
        options: [
          { label: 'Pending', value: 'pending' },
          { label: 'Shipped', value: 'shipped' },
          { label: 'Delivered', value: 'delivered' }
        ]
      }
    ]
  }
}
```

### Field Interactions and Actions

Form fields can trigger actions that modify other fields when specific interactions occur. Use the `action` property in `controlOptions` to define cascading field updates.

```typescript
config: [
  {
    key: 'subscription',
    label: 'Subscription Type',
    controlType: CONTROL_TYPES.SELECT,
    options: [
      { label: 'Basic', value: 'basic' },
      { label: 'Premium', value: 'premium' },
      { label: 'Enterprise', value: 'enterprise' }
    ],
    controlOptions: {
      // Set pricing and features based on subscription selection
      action: (event) => {
        switch (event.value) {
          case 'basic':
            return [
              { key: 'maxUsers', value: 5 },
              { key: 'storage', value: '1GB' },
              { key: 'price', value: 9.99 }
            ];
          case 'premium':
            return [
              { key: 'maxUsers', value: 25 },
              { key: 'storage', value: '10GB' },
              { key: 'price', value: 29.99 }
            ];
          case 'enterprise':
            return [
              { key: 'maxUsers', value: null }, // Unlimited
              { key: 'storage', value: 'Unlimited' },
              { key: 'price', value: null } // Custom pricing
            ];
          default:
            return undefined;
        }
      }
    }
  },
  {
    key: 'hasNotifications',
    label: 'Enable Notifications',
    controlType: CONTROL_TYPES.CHECKBOX,
    controlOptions: {
      // When notifications are disabled, clear email preferences
      action: (event) => event.value === false ? [
        { key: 'emailFrequency', value: null },
        { key: 'emailTypes', value: [] }
      ] : undefined
    }
  },
  {
    key: 'country',
    label: 'Country',
    controlType: CONTROL_TYPES.SELECT,
    options: [
      { label: 'France', value: 'FR' },
      { label: 'Germany', value: 'DE' },
      { label: 'Spain', value: 'ES' }
    ],
    controlOptions: {
      // Reset dependent location fields when country changes
      action: (event) => event.interactionType === 'valueChange' ? [
        { key: 'region', value: null },
        { key: 'city', value: null },
        { key: 'postalCode', value: '' }
      ] : undefined
    }
  }
]
```

#### Field Action Properties

- **`action`**: Function that receives a `FormFieldInteractionEvent` and returns an array of field updates or `undefined`
  - **Input**: `FormFieldInteractionEvent` containing:
    - `key`: The field name that triggered the action
    - `value`: The new value after interaction
    - `interactionType`: Type of interaction ('valueChange', 'focus', 'blur', etc.)
    - `controlType`: The control type that was interacted with
    - `timestamp`: When the interaction occurred
  - **Output**: Array of `{ key: string, value: unknown }` objects or `undefined` for no action

#### Common Use Cases

1. **Conditional Field Clearing**: Clear dependent fields when a parent selection changes
2. **Mutual Exclusion**: Ensure only one of multiple checkboxes can be selected
3. **Auto-Population**: Fill multiple fields based on a single selection
4. **Cascade Updates**: Update pricing, availability, or options based on other field values
5. **Form State Management**: Enable/disable or show/hide related fields

## Advanced Features

### Conditional Logic

```typescript
config: [
  {
    key: 'userType',
    label: 'User Type',
    controlType: CONTROL_TYPES.SELECT,
    options: [
      { label: 'Regular', value: 'regular' },
      { label: 'Admin', value: 'admin' }
    ]
  },
  {
    key: 'adminLevel',
    label: 'Admin Level',
    controlType: CONTROL_TYPES.SELECT,
    options: [
      { label: 'Basic', value: 'basic' },
      { label: 'Super', value: 'super' }
    ],
    conditions: {
      controlOptions: {
        hidden: ({ model }) => model.userType !== 'admin'
      }
    }
  }
]
```

### Nested Form Groups

```typescript
config: [
  {
    key: 'personalInfo',
    label: 'Personal Information',
    controlType: CONTROL_TYPES.GROUP,
    children: [
      {
        key: 'firstName',
        label: 'First Name',
        controlType: CONTROL_TYPES.INPUT
      },
      {
        key: 'lastName',
        label: 'Last Name',
        controlType: CONTROL_TYPES.INPUT
      }
    ]
  }
]
```

### Dynamic Validation

```typescript
config: [
  {
    key: 'email',
    label: 'Email',
    controlType: CONTROL_TYPES.EMAIL,
    conditions: {
      controlOptions: {
        validators: ({ model }) => {
          const validators = [Validators.email];
          if (model.requireEmail) {
            validators.push(Validators.required);
          }
          return validators;
        }
      }
    }
  }
]
```

### Custom Field Components

You can create and integrate your own custom field components to extend the form capabilities beyond the built-in control types. Use `CONTROL_TYPES.CUSTOM` to specify a custom component.

#### Creating a Custom Field Component

Custom field components must extend `FormFieldBaseComponent` which provides:
- Access to field configuration via `config()`
- Access to the form control via `control()`
- Automatic integration with the form's reactive system

```typescript
// request-custom-field.ts
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "@form/ui/renderers/form-field-base.component";

@Component({
  selector: "app-request-custom-field",
  template: `
    <input list="request-models" [formControl]="control()" />
    <datalist id="request-models">
        @for (option of config().options; track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
    </datalist>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class RequestCustomFieldComponent extends FormFieldBaseComponent {}
```

#### Using Custom Fields in Configuration

```typescript
import { RequestCustomFieldComponent } from './request-custom-field';

config: [
  {
    key: 'model',
    label: 'Marque / Modèle',
    controlType: 'custom',
    options: [
      { label: 'Modèle A', value: 'model_a' },
      { label: 'Modèle B', value: 'model_b' },
      { label: 'Modèle C', value: 'model_c' }
    ],
    controlOptions: {
      customComponent: RequestCustomFieldComponent,
      styleClass: 'my-datalist-input',
      validators: [required]
    }
  }
]
```

#### Custom Field Features

- **Full ReactiveFormsModule Support**: Custom components have full access to `[formControl]` binding
- **Configuration Access**: Access field options and configuration via `config()`
- **Validation**: Apply standard validators through `controlOptions.validators`
- **Styling**: Apply custom CSS classes via `controlOptions.styleClass`
- **Options**: Pass data to your custom component through the `options` array

#### Real-World Example

```typescript
// Complete configuration example from request.conf.ts
export const REQUEST_CONF: (payload: ConfPayload) => 
  StrictCrudItemOptions<ItRequest>[] = ({ types, osOptions, accessoryTypes }) => [
  {
    key: "type",
    label: "Type de matériel",
    controlType: "select",
    options: types,
    controlOptions: {
      validators: [required],
    },
  },
  {
    key: "model",
    label: "Marque / Modèle",
    controlType: "custom",
    options: [
      { label: "Modèle A", value: "model_a" },
      { label: "Modèle B", value: "model_b" },
    ],
    controlOptions: {
      customComponent: RequestCustomFieldComponent,
      styleClass: "my-datalist-input",
      validators: [required],
    },
  },
  {
    key: "os",
    label: "Système d'exploitation",
    controlType: "select",
    options: osOptions,
    conditions: {
      options: ({ model }) =>
        osOptions?.filter((option) => model.type === option.type),
      controlOptions: {
        validators: ({ model }) =>
          isModelVisible(model.type) ? [required] : [],
      },
    },
  },
  // ... more fields
];
```

### Custom Styling with styleClass

Apply custom CSS classes to individual form fields using the `styleClass` property in `controlOptions`. This allows for field-specific styling without affecting the global form appearance.

```typescript
config: [
  {
    key: 'username',
    label: 'Username',
    controlType: CONTROL_TYPES.INPUT,
    controlOptions: {
      styleClass: 'highlight-field required-field',
      validators: [required]
    }
  },
  {
    key: 'email',
    label: 'Email Address',
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.EMAIL,
    controlOptions: {
      styleClass: 'email-input large-input',
      validators: [required, Validators.email]
    }
  },
  {
    key: 'priority',
    label: 'Priority',
    controlType: CONTROL_TYPES.SELECT,
    options: priorityOptions,
    controlOptions: {
      styleClass: 'priority-select color-coded'
    }
  }
]
```

#### Multiple Classes

You can apply multiple CSS classes by separating them with spaces:

```typescript
controlOptions: {
  styleClass: 'primary-field validated-input has-tooltip'
}
```

## Usage Examples

### Basic Form
```typescript
<frm-form
  [(model)]="formData"
  [config]="formConfig"
  [showSubmit]="true"
  [showReset]="true"
  (submitted)="onFormSubmit($event)"
  (validityChange)="onValidityChange($event)">
</frm-form>
```

### Multi-Column Form
```typescript
<frm-form
  [(model)]="formData"
  [config]="formConfig"
  [columnsCount]="2"
  [showSubmit]="true"
  submitButtonLabel="Save Changes">
</frm-form>
```

### Read-Only Form
```typescript
<frm-form
  [(model)]="formData"
  [config]="viewConfig"
  [isReadonly]="true"
  [showDebug]="false">
</frm-form>
```

### Form with Custom Validation
```typescript
<frm-form
  [(model)]="formData"
  [config]="formConfig"
  [groupValidator]="validateDateRange"
  [showSubmit]="true"
  (validityChange)="formValid = $event">
</frm-form>
```

## Best Practices

1. **Performance**: Use `forceReload` sparingly as it recreates the entire form
2. **Validation**: Prefer field-level validation over group validation when possible
3. **Conditions**: Keep conditional logic simple and testable
4. **Layout**: Choose appropriate `columnsCount` based on field complexity
5. **Accessibility**: Always provide meaningful labels and error messages
