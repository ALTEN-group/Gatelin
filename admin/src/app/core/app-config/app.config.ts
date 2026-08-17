import {
  inject,
  LOCALE_ID,
  makeEnvironmentProviders,
  provideAppInitializer,
} from "@angular/core";
import { TitleStrategy } from "@angular/router";
import { APP_CONFIG, AppConfig } from "@core/app-config/app-config.token";
import { SIDENAV } from "@core/app-config/app.sidenav";
import { CRUD_LABELS_CONFIG } from "@core/app-config/crud-labels";
import { CustomTitleStrategyService } from "@core/app-config/custom-title-strategy.service";
import { PrimeNgTranslations } from "@core/app-config/primeng-translations";
import { AuthenticationService } from "@core/auth/auth.service";
import {
  APP_FORM_CONFIG,
  APP_CONFIG as CRUD_APP_CONFIG,
  FormTokenData,
  HistorizedData,
  HISTORY_MAPPER,
  provideCrudLabels,
  provideCrudRenderer,
} from "@dwtechs/ngx-crud-builder";
import { filter, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { readAdminRuntimeConfig } from "./runtime-config";

/**
 * Main Config
 */
const TITLE = "Gatelin";
const APP_KEY = "gatelin";
const AppStorageKey = {
  TABLE_CONFIG: `${APP_KEY}_tableConfig`,
  THEME: `${APP_KEY}_theme`,
  TOKEN: `${APP_KEY}_token`,
} as const;

const runtime = readAdminRuntimeConfig();
const passwordRecoveryUrl =
  runtime.passwordRecoveryUrl?.trim() ||
  environment.passwordRecoveryUrl?.trim() ||
  undefined;

export const CONFIG: AppConfig = {
  title: TITLE,
  appKey: APP_KEY,
  storageKeys: AppStorageKey,
  sidenavItems: SIDENAV,
  apiGateway: environment.apiGateway,
  apiUsers: environment.apiUsers,
  passwordRecoveryUrl,
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
    provideCrudRenderer("optimus-ui"),
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
    { provide: APP_FORM_CONFIG, useValue: FORM_CONFIG },
    { provide: TitleStrategy, useClass: CustomTitleStrategyService },
    {
      provide: HISTORY_MAPPER,
      useFactory: () => {
        return (raw: unknown): HistorizedData<unknown> => {
          const r = raw as any;
          const record = { ...r.record };
          return {
            id: r.id,
            tstamp: r.tstamp,
            operation: r.operation,
            updaterId: r.consumerId,
            updaterName: r.consumerName,
            record,
          };
        };
      },
    },
  ]);
}

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
