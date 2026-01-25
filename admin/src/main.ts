/// <reference types="@angular/localize" />

import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from "@angular/common/http";
import {
  enableProdMode,
  importProvidersFrom,
  provideZonelessChangeDetection,
} from "@angular/core";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { authInterceptor } from "@core/auth/auth.interceptor";
import { ROUTES } from "app/app.routes";
import { ConfirmationService, MessageService } from "primeng/api";
import { AppComponent } from "./app/app.component";
import { environment } from "./environments/environment";

import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { provideAppConfig } from "@core/app-config/app.config";
import { errorInterceptor } from "@core/interceptors/error.interceptor";
import { locationInterceptor } from "@core/interceptors/location.interceptor";
import Aura from "@primeng/themes/aura";
import { providePrimeNG } from "primeng/config";
import { DialogService } from "primeng/dynamicdialog";

registerLocaleData(localeFr);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // Leave this one first
    importProvidersFrom(
      BrowserModule,
    ),
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
    provideHttpClient(
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
