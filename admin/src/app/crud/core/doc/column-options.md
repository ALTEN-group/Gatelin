# Column Options Documentation

Column options allow you to customize how table columns are displayed and behave. These options are defined in the `columnOptions` property of a `CrudItemOptions` configuration.

## Table of Contents

- [Basic Options](#basic-options)
- [Rendering Options](#rendering-options)
- [Custom Components](#custom-components)
- [Filter Options](#filter-options)
- [Display Options](#display-options)

---

## Basic Options

### `sortable`
**Type:** `boolean`  
**Default:** `true`

Defines if the column is sortable.

```typescript
{
  key: "name",
  controlType: CONTROL_TYPES.INPUT,
  columnOptions: {
    sortable: true
  }
}
```

### `filterable`
**Type:** `boolean`  
**Default:** `true`

Defines if the column is filterable.

```typescript
{
  key: "email",
  controlType: CONTROL_TYPES.INPUT,
  columnOptions: {
    filterable: false
  }
}
```

---

## Rendering Options

### `customCellRenderer`
**Type:** `(cellValue: unknown) => string`

Specifies a custom renderer function for datatable cells. Returns an HTML string.

⚠️ **Warning:** Be careful when using this property:
- Can lead to performance issues if the function is complex
- XSS security issues if the renderer returns unsafe HTML
- Consider using `customComponent` for complex rendering logic

```typescript
{
  key: "status",
  controlType: CONTROL_TYPES.INPUT,
  columnOptions: {
    customCellRenderer: (cellValue) => 
      `<span class="p-chip ${cellValue === 'active' ? 'green' : 'red'}">${cellValue}</span>`
  }
}
```

### `valueAsChip`
**Type:** `boolean`  
**Default:** `true`

If true and the value is an array, each item will be displayed as a chip.

```typescript
{
  key: "tags",
  controlType: CONTROL_TYPES.MULTISELECT,
  columnOptions: {
    valueAsChip: true
  }
}
```

### `centered`
**Type:** `boolean`  
**Default:** `false`

Cell content will be centered.

```typescript
{
  key: "score",
  controlType: CONTROL_TYPES.INPUT,
  columnOptions: {
    centered: true
  }
}
```

---

## Custom Components

### `customComponent`
**Type:** `Type<unknown>`

Specifies a custom Angular component for rendering datatable cells. This is the recommended approach for complex cell rendering with better performance and maintainability compared to `customCellRenderer`.

**Requirements:**
- The `controlType` must be set to `CONTROL_TYPES.CUSTOM`
- The component must accept two required inputs: `cellValue` and `options`

#### Basic Example

```typescript
// In your configuration file
{
  key: "warnings",
  label: "Warnings",
  controlType: CONTROL_TYPES.CUSTOM,
  columnOptions: {
    customComponent: WarningAlertComponent
  }
}
```

```typescript
// warning-alert.component.ts
import { Component, input } from "@angular/core";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";

@Component({
  selector: "app-warning-alert",
  template: `
    <span class="p-chip" [class.red]="cellValue() > 5">
      {{ cellValue() }}
    </span>
  `,
})
export class WarningAlertComponent {
  public readonly cellValue = input.required<unknown>();
  public readonly options = input.required<CrudItemOptions>();
}
```

#### Advanced Example with Router Link

```typescript
// obso-warning.conf.ts
import { ObsoWarningAlertComponent } from "./obso-warning-alert.component";

export const OBSO_WARNING_COLUMNS: StrictCrudItemOptions<ObsoSummary>[] = [
  {
    key: "warnings",
    label: "W",
    controlType: CONTROL_TYPES.CUSTOM,
    type: INPUT_TYPES.NUMBER,
    columnOptions: {
      customComponent: ObsoWarningAlertComponent,
      filterType: CONTROL_TYPES.INPUT,
    },
  },
  // ... other columns
];
```

```typescript
// obso-warning-alert.component.ts
import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";

@Component({
  selector: "app-obso-warning-alert",
  imports: [RouterLink],
  template: `
    <span class="p-chip red" routerLink="../requests">
      {{ cellValue() }}
    </span>
  `,
})
export class ObsoWarningAlertComponent {
  public readonly options = input.required<CrudItemOptions>();
  public readonly cellValue = input.required<unknown>();
}
```

#### Benefits of Custom Components

✅ **Better Performance:** Components use Angular's change detection and don't re-render unnecessarily  
✅ **Type Safety:** Full TypeScript support and compile-time checking  
✅ **Maintainability:** Easier to test and debug than string-based HTML  
✅ **Security:** No XSS risks - Angular automatically sanitizes  
✅ **Rich Features:** Access to full Angular ecosystem (directives, pipes, services)

---

## Filter Options

### `filterType`
**Type:** `ControlType`

Specifies a specific control type for the filter input. Useful when you want a different filter control than the column's control type.

```typescript
{
  key: "warnings",
  controlType: CONTROL_TYPES.CUSTOM,
  columnOptions: {
    customComponent: WarningAlertComponent,
    filterType: CONTROL_TYPES.INPUT // Filter as text input
  }
}
```

### `defaultFilter`
**Type:** `FilterMetadata | FilterMetadata[]`

Specifies a default value for the filter when the table loads.

```typescript
{
  key: "status",
  controlType: CONTROL_TYPES.SELECT,
  columnOptions: {
    defaultFilter: { value: "active", matchMode: "equals" }
  }
}
```

### `defaultSortField`
**Type:** `boolean`

Should the column be sorted by default when landing on the table.

```typescript
{
  key: "createdAt",
  controlType: CONTROL_TYPES.DATE,
  columnOptions: {
    defaultSortField: true,
    defaultSortOrder: -1 // descending
  }
}
```

### `defaultSortOrder`
**Type:** `-1 | 1`

Should the column be sorted ascending (1) or descending (-1).

---

## Display Options

### `tooltip`
**Type:** `(cellValue: unknown) => SafeHtml`

Custom tooltip renderer for the column cells.

```typescript
{
  key: "description",
  controlType: CONTROL_TYPES.TEXTAREA,
  columnOptions: {
    tooltip: (cellValue) => `Full description: ${cellValue}`
  }
}
```

### `isSoftHidden`
**Type:** `boolean`  
**Default:** `false`

If set to true, the column will be hidden by default but can be unhidden in column management.

```typescript
{
  key: "internalNotes",
  controlType: CONTROL_TYPES.TEXTAREA,
  columnOptions: {
    isSoftHidden: true
  }
}
```

### `isHardHidden`
**Type:** `boolean`  
**Default:** `false`

If set to true, the column will be hidden in the table and in the column management dialog.

```typescript
{
  key: "passwordHash",
  controlType: CONTROL_TYPES.INPUT,
  columnOptions: {
    isHardHidden: true
  }
}
```

### `width`
**Type:** `string`

Column fixed width (for example: '100px'). Default max width is 200px.

```typescript
{
  key: "id",
  controlType: CONTROL_TYPES.INPUT,
  columnOptions: {
    width: "80px"
  }
}
```

### `isFrozen`
**Type:** `boolean`  
**Default:** `false`

Should column be frozen (left by default). Frozen columns should be the first ones in your configuration.

```typescript
{
  key: "name",
  controlType: CONTROL_TYPES.INPUT,
  columnOptions: {
    isFrozen: true
  }
}
```

### `ignoreOnExport`
**Type:** `boolean`  
**Default:** `false`

Specifies if the column should be ignored when exporting data.

```typescript
{
  key: "actions",
  controlType: CONTROL_TYPES.CUSTOM,
  columnOptions: {
    ignoreOnExport: true
  }
}
```

### `label`
**Type:** `string`

If the column should have a different label than the main label defined in CrudItemOptions.

```typescript
{
  key: "firstName",
  label: "First Name",
  controlType: CONTROL_TYPES.INPUT,
  columnOptions: {
    label: "Given Name" // Different label for table column
  }
}
```

### `isCellEditable`
**Type:** `boolean`  
**Default:** `false`

If the column should be editable directly in the table cell.

```typescript
{
  key: "quantity",
  controlType: CONTROL_TYPES.INPUT,
  columnOptions: {
    isCellEditable: true
  }
}
```

---

## Complete Example

```typescript
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { MyCustomCellComponent } from "./my-custom-cell.component";

export const MY_TABLE_CONF: StrictCrudItemOptions<MyEntity>[] = [
  {
    key: "id",
    label: "ID",
    controlType: CONTROL_TYPES.INPUT,
    columnOptions: {
      width: "80px",
      sortable: true,
      filterable: true,
      isFrozen: true,
    },
  },
  {
    key: "name",
    label: "Name",
    controlType: CONTROL_TYPES.INPUT,
    columnOptions: {
      defaultSortField: true,
      defaultSortOrder: 1,
      tooltip: (value) => `Name: ${value}`,
    },
  },
  {
    key: "status",
    label: "Status",
    controlType: CONTROL_TYPES.SELECT,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    columnOptions: {
      customCellRenderer: (value) => 
        `<span class="p-chip ${value === 'active' ? 'green' : 'grey'}">${value}</span>`,
    },
  },
  {
    key: "customData",
    label: "Custom",
    controlType: CONTROL_TYPES.CUSTOM,
    columnOptions: {
      customComponent: MyCustomCellComponent,
      ignoreOnExport: true,
    },
  },
];
```
