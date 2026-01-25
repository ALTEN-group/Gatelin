export type FormFieldInteraction =
  | "blur"
  | "cellClicked"
  | "cellEditComplete"
  | "cellEditInit"
  | "clear"
  | "click"
  | "focus"
  | "keyup"
  | "panelClose"
  | "panelOpen"
  | "rowsSelectionChange"
  | "rowEditInit"
  | "rowEditCancel"
  | "rowEditComplete"
  | "select"
  | "valueChange"
  | "uploadFile"
  | "clearFile"
  | "clearAllFiles";

/**
 * Event emitted when a form field control is interacted with
 */
export interface FormFieldInteractionEvent {
  /** The key/name of the form field */
  key: string;
  /** The type of control (input, select, etc.) */
  controlType: string;
  /** The current value after interaction */
  value: any;
  /** The type of interaction that occurred */
  interactionType: FormFieldInteraction;
  /** Timestamp of the interaction */
  timestamp: Date;
  /** Can store any additional data related to the interaction */
  extraData?: any;
}
