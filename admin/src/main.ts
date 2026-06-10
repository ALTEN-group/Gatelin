/// <reference types="@angular/localize" />

import { registerLocaleData } from "@angular/common";
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
  withXhr
} from "@angular/common/http";
import localeFr from "@angular/common/locales/fr";
import {
  enableProdMode,
  importProvidersFrom,
  provideZonelessChangeDetection,
} from "@angular/core";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { provideAppConfig } from "@core/app-config/app.config";
import { authInterceptor } from "@core/auth/auth.interceptor";
import { errorInterceptor } from "@core/interceptors/error.interceptor";
import { locationInterceptor } from "@core/interceptors/location.interceptor";
import Aura from "@primeng/themes/aura";
import { ROUTES } from "app/app.routes";
import { ConfirmationService, MessageService } from "primeng/api";
import { providePrimeNG } from "primeng/config";
import { DialogService } from "primeng/dynamicdialog";
import { AppComponent } from "./app/app.component";
import { environment } from "./environments/environment";

registerLocaleData(localeFr);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // Leave this one first
    importProvidersFrom(BrowserModule),
    provideZonelessChangeDetection(),
    provideAnimations(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".dark",
        },
      },
    }),
    provideAppConfig(),
    provideHttpClient(withXhr(), 
      withInterceptorsFromDi(),
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        locationInterceptor,
      ]),
    ),
    provideRouter(ROUTES),
    MessageService,
    ConfirmationService,
    DialogService,
  ],
}).catch((err) => console.log(err));
