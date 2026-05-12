import { CrudLabels } from "@dwtechs/crud-builder";

export const CRUD_LABELS_CONFIG: Partial<CrudLabels> = {
  checkbox: {
    no: $localize`:@@Crud_Labels_Checkbox_No:No`,
    yes: $localize`:@@Crud_Labels_Checkbox_Yes:Yes`,
  },
  tableRegular: {
    currentPageReport: (first: string, last: string, totalRecords: string) =>
      `Showing ${first} to ${last} of ${totalRecords} records`,
  },
  archivedConfig: {
    label: "Archived",
    labelAt: "Archived at",
    active: "Active",
    archived: "Archived",
  },
  auditConfig: {
    createdAt: "Created at",
    createdBy: "Created by",
    updatedAt: "Updated at",
    updatedBy: "Updated by",
  },
  columnsDialog: {
    header: "Preferences management",
    cancel: "Cancel",
    save: "Save",
  },
  columnsViews: {
    title: "Views",
    add: "Add",
    delete: "Delete",
    validate: "Validate",
    cancel: "Cancel",
    deleteConfirmation: "Are you sure you want to delete this view?",
  },
  editionDialog: {
    historyHeader: "History of changes",
    archive: "Archive",
    modeCreate: "Create",
    modeConsult: "Consult",
    modeEdit: "Edit",
    cancel: "Cancel",
    close: "Close",
    validate: "Submit",
  },
  form: {
    reset: "Reset",
    submit: "Submit",
    noFields: "No fields available",
  },
  dateControl: {
    close: "Close",
    clear: "Clear",
    today: "Today",
    validate: "Validate",
  },
  toolbar: {
    export: "Export data",
    configureColumns: "Configure columns",
    refresh: "Refresh data",
  },
  exportDialog: {
    header: "Export data",
    chooseFormat: "Choose format",
    chooseData: "Which data?",
    all: "All",
    selection: "Selection",
    cancel: "Cancel",
    export: "Export",
  },
  validators: {
    invalid: "The entered value is invalid",
    required: "This field is required",
    unknownValue: "Please select one of the suggested values",
    emailInvalid: "The email is invalid",
    minlength:
      "The entered value is too short ({requiredLength} characters minimum)",
    maxlength:
      "The entered value is too long ({requiredLength} characters maximum)",
    max: "The value must be less than or equal to {max}",
    min: "The value must be greater than or equal to {min}",
    maxFileSize: "The file size exceeds the maximum allowed size",
  },
};
