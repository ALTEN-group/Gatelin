# TableComponent Documentation

## Overview
A powerful, configurable table component for CRUD operations with built-in features like filtering, sorting, pagination, and export capabilities.

## Inputs

### Core Configuration

#### `config` (required)
**Type:** `CrudItemOptions[]`  
**Description:** Defines the structure and behavior of table columns and form fields.

```typescript
config: [
  {
    key: 'name',
    label: 'Name',
    controlType: CONTROL_TYPES.INPUT,
  },
  {
    key: 'email',
    label: 'Email',
    controlType: CONTROL_TYPES.INPUT,
  }
]
```

#### `httpCalls` (required)
**Type:** `CrudCalls<TData>`  
**Description:** Configuration object containing all HTTP operations for CRUD functionality.

```typescript
httpCalls: {
  get: (params) => this.userService.getUsers(params),
  create: (user) => this.userService.createUser(user),
  update: (user) => this.userService.updateUser(user),
  archive: (ids) => this.userService.deleteUsers(ids)
}
```

#### `entityFactory` (required)
**Type:** `CrudItemFactory<TData>`  
**Description:** Factory function that creates new entity instances for the creation dialog.

```typescript
entityFactory: () => ({
  id: null,
  name: '',
  email: '',
  status: 'active'
})
```

#### `entityId` (required)
**Type:** `string`  
**Description:** Unique identifier for the entity type, used for persisting column preferences.

```typescript
entityId: "users"
```

#### `tableTitle` (required)
**Type:** `string`  
**Description:** Display title shown at the top of the table component.

```typescript
tableTitle: "Users"
```

### Display & Behavior

#### `clickableRows`
**Type:** `boolean` | **Default:** `true`  
**Description:** Determines user interaction mode with table rows.

```typescript
// Clickable rows - click anywhere on row to edit
clickableRows: true

// Non-clickable rows - only action buttons work
clickableRows: false
```

#### `lazy`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables lazy loading mode for large datasets.

```typescript
// For large datasets (>1000 rows)
lazy: true

// Load all data at once (<500 rows)
lazy: false
```

#### `selectable`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables row selection with checkboxes for bulk operations.

#### `customRowStyles`
**Type:** `(row: TData) => Record<string, string>`  
**Description:** Applies conditional CSS styles to table rows.

```typescript
customRowStyles: (row) => ({
  'background-color': row.status === 'inactive' ? '#ffe6e6' : '',
  'color': row.priority === 'high' ? '#d32f2f' : ''
})
```

### Table Features

#### `filterable`
**Type:** `boolean` | **Default:** `true`  
**Description:** Enables/disables column filtering functionality.

#### `sortable`
**Type:** `boolean` | **Default:** `true`  
**Description:** Enables column sorting functionality.

#### `paginator`
**Type:** `boolean` | **Default:** `true`  
**Description:** Enables pagination controls.

#### `filterLevel`
**Type:** `FilterLevel` | **Default:** `"basic"`  
**Description:** Defines the complexity level of filtering interface.

#### `isContextMenuEnabled`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables the context menu on right-clicking table rows.

When enabled, right-clicking a row shows a context menu with actions like View and Edit. Context menu actions emit the same events as clicking the row or action buttons. Useful for providing quick access to common actions without cluttering the UI.

```typescript
// Enable context menu
isContextMenuEnabled: true

// Disable context menu (default)
isContextMenuEnabled: false
```

### Export Options

#### `isCsvExportEnabled`
**Type:** `boolean` | **Default:** `true`  
**Description:** Enables CSV export functionality.

#### `isExcelExportEnabled`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables Excel export functionality.

#### `excelExportMode`
**Type:** `ExcelExportMode` | **Default:** `"server"`  
**Description:** Determines how Excel export is processed: by front-end ('local') or by back-end ('server').

### Dialog Configuration

#### `editionDialogWidth`
**Type:** `string` | **Default:** `"70vw"`  
**Description:** Sets the width of the edition/creation dialog modal.

```typescript
// Standard width
editionDialogWidth: "70vw"

// Narrow for simple forms
editionDialogWidth: "400px"

// Wide for complex forms
editionDialogWidth: "90vw"
```

#### `isDefaultEditionDisabled`
**Type:** `boolean` | **Default:** `false`  
**Description:** Disables the default edition modal dialog.

#### `editionDialogTitle`
**Type:** `string` | **Default:** `""`  
**Description:** Custom title for the edition dialog.

#### `protectDeletion`
**Type:** `boolean` | **Default:** `false`  
**Description:** Adds a "danger zone" section to the edition dialog.

### Access Control & Navigation

#### `functionalityKey`
**Type:** `number | undefined`  
**Description:** Links the table to a specific functionality for access control.

#### `canAccessItemFromUrl`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables deep linking to specific items by adding their ID to the URL.

### Column Management

#### `areColumnsConfigurable`
**Type:** `boolean` | **Default:** `true`  
**Description:** Controls whether columns can be hidden/shown through the configuration dialog.

### Advanced Options

#### `entityLabel`
**Type:** `string` | **Default:** `""`  
**Description:** Human-readable label for a single entity instance.

#### `forceReload`
**Type:** `number`  
**Description:** Trigger for forcing table data reload from parent component.

#### `groupValidator`
**Type:** `ValidatorFn | undefined`  
**Description:** Custom validator function applied to the entire form group.

```typescript
groupValidator: (group: AbstractControl) => {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;
  return start && end && start > end ? { dateRange: true } : null;
}
```

#### `customActionsTemplate`
**Type:** `TemplateRef<unknown>`  
**Description:** Custom template for actions in the table's action column. Allows injection of custom buttons or controls in place of the default edit/delete actions.

The template receives the current row data as context via `let-rowData`, enabling dynamic action visibility and behavior based on row content.

```typescript
// Component template
<tbl-table 
  [config]="userConfig"
  [httpCalls]="userHttpCalls"
  [entityFactory]="userFactory"
  [customActionsTemplate]="customActions"
  entityId="users"
  tableTitle="Users">
</tbl-table>

<ng-template #customActions let-rowData>
  <!-- View details action -->
  <p-button 
    icon="pi pi-eye" 
    severity="info" 
    size="small"
    (onClick)="viewDetails(rowData)"
    [pTooltip]="'View Details'">
  </p-button>
  
  <!-- Conditional duplicate action -->
  <p-button 
    *ngIf="rowData.status === 'active'"
    icon="pi pi-copy" 
    severity="secondary" 
    size="small"
    (onClick)="duplicate(rowData)"
    [pTooltip]="'Duplicate'">
  </p-button>
  
  <!-- Export action with confirmation -->
  <p-button 
    icon="pi pi-download" 
    severity="help" 
    size="small"
    (onClick)="exportItem(rowData)"
    [pTooltip]="'Export Item'">
  </p-button>
</ng-template>
```

```typescript
// Component class methods
export class MyComponent {
  viewDetails(rowData: User): void {
    this.router.navigate(['/users', rowData.id, 'details']);
  }
  
  duplicate(rowData: User): void {
    const duplicated = { ...rowData, id: null, name: `${rowData.name} (Copy)` };
    this.userService.createUser(duplicated).subscribe();
  }
  
  exportItem(rowData: User): void {
    this.exportService.exportSingleUser(rowData.id);
  }
}
```

## Outputs

- `editionDialogClosed: TData | null` - Emitted when edition dialog is closed
- `formChanged: TData` - Emitted when form values change
- `newClicked: void` - Emitted when new button is clicked
- `rowClicked: TData` - Emitted when a row is clicked
- `validityChanged: boolean` - Emitted when form validity changes

## Usage Examples

### Basic Table
```typescript
<tbl-table
  [config]="userConfig"
  [httpCalls]="userHttpCalls"
  [entityFactory]="userFactory"
  entityId="users"
  tableTitle="Users"
  entityLabel="User">
</tbl-table>
```

### Advanced Table with Custom Features
```typescript
<tbl-table
  [config]="orderConfig"
  [httpCalls]="orderHttpCalls"
  [entityFactory]="orderFactory"
  entityId="orders"
  tableTitle="Purchase Orders"
  entityLabel="Order"
  [lazy]="true"
  [selectable]="true"
  [canAccessItemFromUrl]="true"
  [isExcelExportEnabled]="true"
  [customRowStyles]="getOrderRowStyles"
  [functionalityKey]="orders"
  editionDialogWidth="80vw">
</tbl-table>
```
