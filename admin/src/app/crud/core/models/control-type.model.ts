export const CONTROL_TYPES = {
  AUTOCOMPLETE: "autocomplete",
  CHECKBOX: "checkbox",
  CUSTOM: "custom",
  DATE: "date",
  FILES: "files",
  GROUP: "group", // Stores nested formGroups
  INPUT: "input",
  MULTISELECT: "multiselect",
  PICKLIST: "picklist",
  RADIO: "radio",
  SELECT: "select",
  SELECT_BUTTON: "select_button",
  TABLE: "table",
  TEXTAREA: "textarea"
} as const;

export type ControlType = (typeof CONTROL_TYPES)[keyof typeof CONTROL_TYPES];
