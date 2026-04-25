import { InjectionToken } from "@angular/core";
import { Environment } from "environments/environment.model";
import { MenuItem } from "primeng/api";

export interface AppConfig {
  title: string;
  appKey: string;
  storageKeys: { [key: string]: string };
  sidenavItems: MenuItem[];
  apiGateway: string;
  apiUsers: string;
  env: Partial<Environment>;
}

const defaultValue: AppConfig = {
  title: "",
  appKey: "",
  storageKeys: {},
  sidenavItems: [],
  apiGateway: "/api/",
  apiUsers: "/api/users/",
  env: {},
};

export const APP_CONFIG = new InjectionToken<AppConfig>("APP_CONFIG", {
  providedIn: "root",
  factory: () => defaultValue,
});
