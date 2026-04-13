import {
  APP_FORM_CONFIG,
  FormTokenData,
  HistorizedData,
  HISTORY_MAPPER,
} from "@altengroup/crud-builder";
import {
  inject,
  LOCALE_ID,
  makeEnvironmentProviders,
  provideAppInitializer,
} from "@angular/core";
import { TitleStrategy } from "@angular/router";
import { APP_CONFIG, AppConfig } from "@core/app-config/app-config.token";
import { SIDENAV } from "@core/app-config/app.sidenav";
import { CustomTitleStrategyService } from "@core/app-config/custom-title-strategy.service";
import { AuthenticationService } from "@core/auth/auth.service";
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
} as const;
export const CONFIG: AppConfig = {
  title: TITLE,
  appKey: APP_KEY,
  storageKeys: AppStorageKey,
  sidenavItems: SIDENAV,
  apiPrefix: environment.apiGateway,
  env: environment,
};

const FORM_CONFIG: FormTokenData = {
  customErrorMessages: {
    unsafeWords: $localize`:@@Validators_UnsafeWords:Le texte contient des mots non autorisés : {words}`,
    minDate: $localize`:@@Validators_MinDate:La date doit être au moins à {days} jour(s) après aujourd'hui`,
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
    { provide: APP_FORM_CONFIG, useValue: FORM_CONFIG }, // remove if no @form
    { provide: TitleStrategy, useClass: CustomTitleStrategyService }, // remove if no custom titles
    {
      provide: HISTORY_MAPPER,
      useValue: (raw: unknown): HistorizedData<unknown> => {
        const r = raw as any;
        return {
          tstamp: r.timestamp,
          operation: r.action,
          updaterId: r.consumerId,
          updaterName: r.consumerName,
          val: r.data,
          table_name: "users",
        };
      },
    },
  ]);
}

// TODO: un petit loading spinner serait pas mal :)
function checkToken(authService: AuthenticationService) {
  return authService.refreshToken().pipe(
    tap((success) => {
      if (!success) {
        authService.redirectToLogin();
      }
    }),
    filter(Boolean),
    authService.getUserBasics(),
  );
}
