import { inject, LOCALE_ID, makeEnvironmentProviders, provideAppInitializer, } from "@angular/core";
import { TitleStrategy } from "@angular/router";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { SIDENAV } from "@core/app-config/app.sidenav";
import { CRUD_LABELS_CONFIG } from "@core/app-config/crud-labels";
import { CustomTitleStrategyService } from "@core/app-config/custom-title-strategy.service";
import { PrimeNgTranslations } from "@core/app-config/primeng-translations";
import { AuthenticationService } from "@core/auth/auth.service";
import { APP_FORM_CONFIG, APP_CONFIG as CRUD_APP_CONFIG, HISTORY_MAPPER, provideCrudLabels, } from "@dwtechs/crud-builder";
import { environment } from "environments/environment";
import { filter, tap } from "rxjs";
/**
 * Main Config
 */
const TITLE = "Gatelin";
const APP_KEY = "gatelin";
const AppStorageKey = {
    TABLE_CONFIG: `${APP_KEY}_tableConfig`,
    THEME: `${APP_KEY}_theme`,
    TOKEN: `${APP_KEY}_token`,
    REFRESH_TOKEN: `${APP_KEY}_refreshToken`,
};
export const CONFIG = {
    title: TITLE,
    appKey: APP_KEY,
    storageKeys: AppStorageKey,
    sidenavItems: SIDENAV,
    apiGateway: environment.apiGateway,
    apiUsers: environment.apiUsers,
    env: environment,
};
const FORM_CONFIG = {
    customErrorMessages: {
        unsafeWords: $localize `:@@Validators_UnsafeWords:Le texte contient des mots non autorisés : {words}`,
        minDate: $localize `:@@Validators_MinDate:La date doit être au moins à {days} jour(s) après aujourd'hui`,
    },
};
export function provideAppConfig() {
    return makeEnvironmentProviders([
        provideAppInitializer(() => {
            const authService = inject(AuthenticationService);
            return checkToken(authService);
        }),
        { provide: LOCALE_ID, useValue: "fr" },
        { provide: APP_CONFIG, useValue: CONFIG },
        {
            provide: CRUD_APP_CONFIG,
            useValue: {
                title: CONFIG.title,
                appKey: CONFIG.appKey,
                storageKeys: CONFIG.storageKeys,
                apiPrefix: environment.apiGateway,
            },
        },
        provideCrudLabels(CRUD_LABELS_CONFIG, PrimeNgTranslations),
        { provide: APP_FORM_CONFIG, useValue: FORM_CONFIG }, // remove if no @form
        { provide: TitleStrategy, useClass: CustomTitleStrategyService }, // remove if no custom titles
        {
            provide: HISTORY_MAPPER,
            useValue: (raw) => {
                const r = raw;
                return {
                    id: r.id,
                    tstamp: r.tstamp,
                    operation: r.operation,
                    updaterId: r.consumerId,
                    updaterName: r.consumerName,
                    record: r.record,
                };
            },
        },
    ]);
}
function checkToken(authService) {
    return authService.refreshToken().pipe(tap((success) => {
        if (!success) {
            authService.redirectToLogin();
        }
    }), filter(Boolean), authService.getUserBasics());
}
//# sourceMappingURL=app.config.js.map