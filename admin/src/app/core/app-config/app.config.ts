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
  ColumnConfig,
  APP_CONFIG as CRUD_APP_CONFIG,
  FormTokenData,
  HistorizedData,
  HISTORY_MAPPER,
  provideCrudLabels,
  provideFormFieldRenderer,
  TableConfig,
  TableConfigService,
} from "@dwtechs/ngx-crud-builder";
import { ResourcesService } from "app/routing/data-access/resources/resources.service";
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
} as const;
export const CONFIG: AppConfig = {
  title: TITLE,
  appKey: APP_KEY,
  storageKeys: AppStorageKey,
  sidenavItems: SIDENAV,
  apiGateway: environment.apiGateway,
  apiUsers: environment.apiUsers,
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
    provideFormFieldRenderer("primeng"),
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
      useFactory: () => {
        // route history records only ever contain the base "route" table's own
        // columns (resourceId, name, ...) — serviceId/serviceName are derived
        // via a view join (route -> resource -> service) and were never part
        // of that snapshot, so restoring an old version left the Service
        // select empty. Backfill serviceId/serviceName (as real values, not
        // display names — restoring sets these straight into the form, and
        // the serviceId select matches options by numeric id) from resourceId
        // using the already-loaded Resources cache.
        const resourcesById = new Map<
          number,
          { serviceId: number | null; serviceName: string }
        >();

        inject(ResourcesService)
          .getAndCacheAll()
          .subscribe((resources) => {
            resourcesById.clear();
            for (const resource of resources)
              if (resource.id !== null)
                resourcesById.set(resource.id, {
                  serviceId: resource.serviceId,
                  serviceName: resource.serviceName,
                });
          });

        // Field display order in the history panel follows the record's own
        // key order, so mirror the user's active "routes" datagrid column
        // preference to keep both views consistent.
        let routesColumnOrder: string[] = [];

        inject(TableConfigService)
          .getViews("routes")
          .subscribe((views: TableConfig[]) => {
            const activeView = views.find((view) => view.isActive) ?? views[0];
            routesColumnOrder =
              activeView?.conf?.map((col: ColumnConfig) => col.key) ?? [];
          });

        return (raw: unknown): HistorizedData<unknown> => {
          const r = raw as any;
          const original = { ...r.record };
          if ("resourceId" in original && original.resourceId != null) {
            const resource = resourcesById.get(original.resourceId);
            if (resource) {
              original.serviceId = resource.serviceId;
              original.serviceName = resource.serviceName;
            }
          }
          let record = original;
          if (routesColumnOrder.length > 0) {
            record = {};
            for (const key of routesColumnOrder)
              if (key in original) record[key] = original[key];
            for (const key of Object.keys(original))
              if (!(key in record)) record[key] = original[key];
          }
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
