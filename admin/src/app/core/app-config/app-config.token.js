import { InjectionToken } from "@angular/core";
const defaultValue = {
    title: "",
    appKey: "",
    storageKeys: {},
    sidenavItems: [],
    apiGateway: "/api/",
    apiUsers: "/api/users/",
    env: {},
};
export const APP_CONFIG = new InjectionToken("APP_CONFIG", {
    providedIn: "root",
    factory: () => defaultValue,
});
//# sourceMappingURL=app-config.token.js.map