import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { INPUT_TYPES } from "@crud/core/models/input-type.model";

export interface Socials {
  website: string;
  video: string;
  instagram: string;
  facebook: string;
  x: string;
  linkedin: string;
}

export const INIT_SOCIALS: Socials = {
  website: "",
  video: "",
  instagram: "",
  facebook: "",
  x: "",
  linkedin: "",
};

export const SOCIALS_CONFIG: StrictCrudItemOptions<Socials>[] = [
  {
    key: "website",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "Site web",
    controlOptions: {
      inputIcon: "pi pi-globe",
    },
    columnOptions: {
      isSoftHidden: true,
    },
  },
  {
    key: "video",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "Lien vidéo",
    controlOptions: {
      inputIcon: "pi pi-youtube",
    },
    columnOptions: {
      isSoftHidden: true,
    },
  },
  {
    key: "instagram",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "Lien Instagram",
    controlOptions: {
      inputIcon: "pi pi-instagram",
    },
    columnOptions: {
      isSoftHidden: true,
    },
  },
  {
    key: "facebook",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "Lien Facebook",
    controlOptions: {
      inputIcon: "pi pi-facebook",
    },
    columnOptions: {
      isSoftHidden: true,
    },
  },
  {
    key: "x",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "Lien X",
    controlOptions: {
      inputIcon: "pi pi-twitter",
    },
    columnOptions: {
      isSoftHidden: true,
    },
  },
  {
    key: "linkedin",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "Lien Linkedin",
    controlOptions: {
      inputIcon: "pi pi-linkedin",
    },
    columnOptions: {
      isSoftHidden: true,
    },
  },
];
