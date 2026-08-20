import { InjectionToken } from "@angular/core";
import { MenuItem } from "@openng/optimus-ui/api";
import { Environment } from "../../../environments/environment.model";

export interface AppConfig {
  title: string;
  appKey: string;
  storageKeys: { [key: string]: string };
  sidenavItems: MenuItem[];
  gatelinApi: string;
  apiUsers: string;
  /** Shown on login when set (from env / Docker). */
  passwordRecoveryUrl?: string;
  env: Partial<Environment>;
}

const defaultValue: AppConfig = {
  title: "",
  appKey: "",
  storageKeys: {},
  sidenavItems: [],
  gatelinApi: "/api/",
  apiUsers: "/api/users/",
  passwordRecoveryUrl: undefined,
  env: {},
};

export const APP_CONFIG = new InjectionToken<AppConfig>("APP_CONFIG", {
  providedIn: "root",
  factory: () => defaultValue,
});
