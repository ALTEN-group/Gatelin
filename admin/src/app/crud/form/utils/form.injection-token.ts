import { InjectionToken } from "@angular/core";

export interface FormTokenData {
  customErrorMessages?: { [key: string]: string };
}

const defaultValue: FormTokenData = {
  customErrorMessages: {},
};

export const APP_FORM_CONFIG = new InjectionToken<FormTokenData>(
  "APP_FORM_CONFIG",
  {
    providedIn: "root",
    factory: () => defaultValue,
  },
);
