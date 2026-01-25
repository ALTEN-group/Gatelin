import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { INPUT_TYPES } from "@crud/core/models/input-type.model";
import { maxlength, minlength, required } from "@form/utils/common.validators";

export interface GeoCoordinates {
  location: [lng: number, lat: number];
  street: string;
  zipCode: string;
  city: string;
  label: string;
}

export const INIT_COORDINATES: GeoCoordinates = {
  location: [0, 0],
  street: "",
  zipCode: "",
  city: "",
  label: "",
};

export const LOCATION_CONFIG: StrictCrudItemOptions<GeoCoordinates>[] = [
  {
    key: "street",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "Adresse",
    columnOptions: {},
    controlOptions: {
      validators: [required, minlength(4)],
      minLength: 4,
      // searchOptionsFn: (query: string) =>
      //   this.geoService.search(query, "housenumber").pipe(
      //     map((payload) => {
      //       return (payload.rows || []).map((res) => ({
      //         value: res.street,
      //         label: res.street,
      //         extraData: res,
      //         displayValue: res.label,
      //       }));
      //     }),
      //   ),
      // onSelect: (event: AutocompleteItem) => {
      //   return [
      //     {
      //       ctrl: "city",
      //       value: event.extraData.city,
      //     },
      //     {
      //       ctrl: "zipCode",
      //       value: event.extraData.zipCode,
      //     },
      //     {
      //       ctrl: "location",
      //       value: event.extraData.location,
      //     },
      //   ];
      // },
    },
  },
  {
    key: "zipCode",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "Code postal",
    columnOptions: {},
    controlOptions: {
      validators: [required, minlength(5), maxlength(5)],
      minLength: 5,
      maxLength: 5,
      // searchOptionsFn: (query: string) =>
      //   this.geoService.search(query).pipe(
      //     map((payload) => {
      //       return (payload.rows || []).map((res) => ({
      //         value: res.zipCode,
      //         label: res.zipCode,
      //         extraData: res,
      //         displayValue: `${res.city} (${res.zipCode})`,
      //       }));
      //     }),
      //   ),
      // onSelect: (event: AutocompleteItem) => {
      //   return [
      //     { ctrl: "city", value: event.extraData.city },
      //     {
      //       ctrl: "location",
      //       value: event.extraData.location,
      //     },
      //   ];
      // },
    },
  },
  {
    key: "city",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "Ville",
    columnOptions: {},
    controlOptions: {
      validators: [required],
      // searchOptionsFn: (query: string) =>
      //   this.geoService.search(query).pipe(
      //     map((payload) => {
      //       return (payload.rows || []).map((res) => ({
      //         value: res.city,
      //         label: res.city,
      //         extraData: res,
      //         displayValue: `${res.city} (${res.zipCode})`,
      //       }));
      //     }),
      //   ),
      // onSelect: (event: AutocompleteItem) => {
      //   return [
      //     { ctrl: "zipCode", value: event.extraData.zipCode },
      //     {
      //       ctrl: "location",
      //       value: event.extraData.location,
      //     },
      //   ];
      // },
    },
  },
  // {
  //   key: "location",
  //   label: "Lng/Lat",
  //   controlType: CONTROL_TYPES.MAP,
  //   columnOptions: {
  //     isHardHidden: true,
  //   },
  //   controlOptions: {
  //     // validators: [Validators.required],
  //     hidden: true,
  //     minWidth: "100%",
  //     // hidden: true,
  //   },
  // },
];
