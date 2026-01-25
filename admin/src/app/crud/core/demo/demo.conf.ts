import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { INPUT_TYPES } from "@crud/core/models/input-type.model";
import {
  max,
  min,
  minlength,
  required,
  requiredTrue,
} from "@form/utils/common.validators";
import { EmailValidator } from "@form/utils/email.validator";

export const DEMO_CONF: CrudItemOptions[] = [
  // INPUT FIELDS
  {
    key: "name",
    label: "Name",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      inputIcon: "pi pi-user",
      validators: [required, minlength(2)],
    },
  },
  {
    key: "email",
    label: "Email Address",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
      inputIcon: "pi pi-envelope",
      validators: [required, EmailValidator],
    },
  },
  {
    key: "age",
    label: "Age",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.NUMBER,
    controlOptions: {
      inputIcon: "pi pi-gift",
      validators: [required, min(18), max(120)],
    },
  },
  {
    key: "salary",
    label: "Annual Salary",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.NUMBER,
    controlOptions: {
      inputIcon: "pi pi-euro",
      validators: [min(0)],
    },
  },

  // TEXTAREA
  {
    key: "description",
    label: "Description",
    controlType: CONTROL_TYPES.TEXTAREA,
    controlOptions: {
      validators: [minlength(10)],
      width: "100%",
    },
  },

  // DATE
  {
    key: "birthDate",
    label: "Birth Date",
    controlType: CONTROL_TYPES.DATE,
    controlOptions: {
      inputIcon: "pi pi-calendar",
      validators: [required],
    },
  },
  // SELECT
  {
    key: "country",
    label: "Country",
    controlType: CONTROL_TYPES.SELECT,
    options: [
      { label: "France", value: "FR" },
      { label: "Germany", value: "DE" },
      { label: "Spain", value: "ES" },
      { label: "Italy", value: "IT" },
      { label: "United Kingdom", value: "UK" },
    ],
    controlOptions: {
      inputIcon: "pi pi-flag",
    },
  },

  // MULTISELECT
  {
    key: "languages",
    label: "Languages",
    controlType: CONTROL_TYPES.MULTISELECT,
    options: [
      { label: "French", value: "fr" },
      { label: "English", value: "en" },
      { label: "German", value: "de" },
      { label: "Spanish", value: "es" },
      { label: "Italian", value: "it" },
    ],
  },

  // AUTOCOMPLETE
  {
    key: "city",
    label: "City",
    controlType: CONTROL_TYPES.AUTOCOMPLETE,
    options: [
      { label: "Paris", value: "paris" },
      { label: "London", value: "london" },
      { label: "Berlin", value: "berlin" },
      { label: "Madrid", value: "madrid" },
      { label: "Rome", value: "rome" },
      { label: "Barcelona", value: "barcelona" },
      { label: "Munich", value: "munich" },
      { label: "Milan", value: "milan" },
    ],
    controlOptions: {
      inputIcon: "pi pi-map-marker",
    },
  },

  // RADIO
  {
    key: "gender",
    label: "Gender",
    controlType: CONTROL_TYPES.RADIO,
    options: [
      { label: "Male", value: "M" },
      { label: "Female", value: "F" },
    ],
    controlOptions: {
      radioOptionsDirection: "row",
      validators: [required],
    },
  },

  // SELECT_BUTTON
  {
    key: "subscription",
    label: "Subscription Type",
    controlType: CONTROL_TYPES.SELECT_BUTTON,
    options: [
      { label: "Basic", value: "basic" },
      { label: "Premium", value: "premium" },
      { label: "Enterprise", value: "enterprise" },
    ],
    controlOptions: {
      validators: [required],
      isSelectButtonOptionToggleable: true,
    },
  },

  // CHECKBOX
  {
    key: "newsletter",
    label: "Subscribe to Newsletter",
    controlType: CONTROL_TYPES.CHECKBOX,
    controlOptions: {},
  },
  {
    key: "terms",
    label: "I accept the Terms and Conditions",
    controlType: CONTROL_TYPES.CHECKBOX,
    controlOptions: {
      validators: [requiredTrue],
    },
  },

  // FILES
  {
    key: "avatar",
    label: "Profile Picture",
    controlType: CONTROL_TYPES.FILES,
    controlOptions: {
      multiple: false,
      maxFileSize: 5000000, // 5MB
      mediaType: "image",
      isPreviewEnabled: true,
      width: "100%",
    },
  },

  // WYSIWYG
  {
    key: "biography",
    label: "Biography",
    controlType: CONTROL_TYPES.WYSIWYG,
    controlOptions: {
      validators: [minlength(50)],
      width: "100%",
    },
  },

  // GROUP - Nested form group
  {
    key: "address",
    label: "Address Information",
    controlType: CONTROL_TYPES.GROUP,
    children: [
      {
        key: "street",
        label: "Street",
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          inputIcon: "home",
          validators: [required],
        },
      },
      {
        key: "addressCity",
        label: "City",
        controlType: CONTROL_TYPES.INPUT,
        type: INPUT_TYPES.TEXT,
        controlOptions: {
          inputIcon: "location_city",
          validators: [required],
        },
      },
    ],
  },
  {
    key: "skills",
    label: "Skills",
    controlType: CONTROL_TYPES.PICKLIST,
    options: [
      { label: "JavaScript", value: "js" },
      { label: "TypeScript", value: "ts" },
      { label: "Angular", value: "angular" },
      { label: "React", value: "react" },
      { label: "Vue.js", value: "vue" },
      { label: "Node.js", value: "node" },
      { label: "Python", value: "python" },
      { label: "Java", value: "java" },
    ],
    controlOptions: {
      width: "100%",
    },
  },

  // TABLE
  {
    key: "workExperience",
    label: "Work Experience",
    controlType: CONTROL_TYPES.TABLE,
    controlOptions: {
      width: "100%",
      tableCtrlConfig: {
        // Configuration du tableau avec en-têtes visibles
      },
      tableCtrlColumns: [
        {
          key: "company",
          label: "Company",
          controlType: "input",
          type: "text",
          controlOptions: {
            validators: [required],
          },
        },
        {
          key: "position",
          label: "Position",
          controlType: "input",
          type: "text",
          controlOptions: {
            validators: [required],
          },
        },
        {
          key: "skills",
          label: "Skills Used",
          controlType: "multiselect",
          options: [
            { label: "JavaScript", value: "js" },
            { label: "TypeScript", value: "ts" },
            { label: "Angular", value: "angular" },
            { label: "React", value: "react" },
            { label: "Vue.js", value: "vue" },
            { label: "Node.js", value: "node" },
            { label: "Python", value: "python" },
            { label: "Java", value: "java" },
          ],
        },
        {
          key: "duration",
          label: "Duration (months)",
          controlType: "input",
          type: "number",
          controlOptions: {
            validators: [required, min(1)],
          },
        },
      ],
    },
  },
];
