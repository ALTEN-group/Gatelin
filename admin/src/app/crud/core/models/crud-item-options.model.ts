import { ColumnOptions } from "@crud/core/models/column-options.model";
import { ControlOptions } from "@crud/core/models/control-options.model";
import { ControlType } from "@crud/core/models/control-type.model";
import { InputType } from "@crud/core/models/input-type.model";
import { FileInfo } from "@form/ui/renderers/file-upload-input/file-info.class";
import { SelectItem } from "primeng/api";

/**
 * Use StrictCrudItemOptions to enforce type checking in your crud options
 * For example if you have to display objects with properties { name, age },
 * you won't be able to declare a crud item with an other key than name or age;
 */
export interface StrictCrudItemOptions<T>
  extends Omit<CrudItemOptions, "key" | "conditions"> {
  key: keyof T;
  conditions?: ItemCondition<T>;
}

export interface CrudItemOptions {
  /** Unique identifier */
  key: string;
  /** Label of the form control and the datatable column */
  label: string;
  /** Represents the type of the form control: input, select, autocomplete... */
  controlType: ControlType;
  /**
   * Specifies the type of the form control when it's an 'input': text, number...
   * Specifies if the file is an image
   */
  type?: InputType;
  /** Contains the options of a 'select' or 'multiselect' form control */
  options?: SelectItem[];
  /** Sub-items for nested forms */
  children?: CrudItemOptions[] /**
   * Specifies the way to resolve path given information from the backend
   * Will be used to:
   * - display already uploaded files in the control
   * - set the download path when user clicks to download
   * @example `filesPathResolver: (model) => ({src:`${environment.apiGateway}/model.uuid`, name: model.name}) // Extracts file path from model object
   */;
  filesPathResolver?: (model: any) => FileInfo[];
  /** Defines the options specific to the datatable column */
  columnOptions?: ColumnOptions;
  /** Defines the options specific to the form control */
  controlOptions?: ControlOptions;
  /**
   * @new stores new way to handle forms
   * This is a map of conditions that will be evaluated
   * to determine the value of a property in the controlOptions.
   *
   * The function should return a value that will be assigned to the property.
   *
   * For example:
   *
   * ```typescript
   * conditions: {
   *   controlOptions: {
   *     disabled: ({item, model}) => model.age < 18,
   *   }
   * }
   * ```
   */
  conditions?: ItemCondition;
}

/**
 * This type is used to define the structure of the conditions
 * that can be used in the CrudItemOptions.
 */
export type ItemCondition<T = any> = {
  [Prop in keyof CrudItemOptions]?: ConditionFn<T> | ControlOptionsCondition<T>;
};

export type ControlOptionsCondition<T = any> = {
  [Prop in keyof ControlOptions]?: ConditionFn<T>;
};

export type ConditionFn<T = any> = (conditionsArgs: {
  control: CrudItemOptions;
  model: T;
}) => unknown;
