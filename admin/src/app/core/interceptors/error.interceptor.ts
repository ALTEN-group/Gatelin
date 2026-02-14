import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import { effect, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "@core/auth/auth.service";
import { TokenService } from "@core/auth/token.service";
import { cloneReq } from "@core/interceptors/clone-req";
import { LoadingService } from "@core/utils/loading/loading.service";
import { SnackbarService } from "@core/utils/snackbar/snackbar.service";
import { isCacheable } from "@crud/core/utils/offline/cacheable.utils";
import { OfflineService } from "@crud/core/utils/offline/offline.service";
import {
  EMPTY,
  bufferCount,
  catchError,
  forkJoin,
  switchMap,
  throwError,
} from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbarService = inject(SnackbarService);
  const loadingService = inject(LoadingService);
  const offlineService = inject(OfflineService);
  const authenticationService = inject(AuthenticationService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  let pendingRequests: HttpRequest<unknown>[] = [];

  effect(() => {
    if (offlineService.isOnline() && pendingRequests.length) {
      forkJoin(pendingRequests.map((r) => next(r)))
        .pipe(bufferCount(pendingRequests.length))
        .subscribe();
      pendingRequests = [];
    }
  });

  const isUnauthorized = (err: HttpErrorResponse) => {
    return err.status === 401;
  };

  const returnError = (err: HttpErrorResponse) => {
    // TODO: maybe return error depending on status
    snackbarService.displayError(err.message);
    return throwError(() => err);
  };

  const redirectToLogin = (err: HttpErrorResponse) => {
    router.navigate(["/login"]);
    return returnError(err);
  };

  const refreshToken = (err: HttpErrorResponse) => {
    return authenticationService.refreshToken().pipe(
      switchMap((res) => {
        const token = tokenService.getRefreshToken();
        if (!res || !token) {
          return redirectToLogin(err);
        }
        // Assign new token and replay the request
        return next(cloneReq(req, token));
      }),
      catchError(() => redirectToLogin(err)),
    );
  };

  const handleOfflineMode = () => {
    if (isCacheable(req)) {
      pendingRequests.push(req);
      snackbarService.displayInfo($localize`:@@offlineMessage:`);
    } else {
      snackbarService.displayError($localize`:@@noInternetConnection:`);
    }
    return throwError(() => new Error("No internet connection"));
  };

  return next(req).pipe(
    catchError((err) => {
      loadingService.stop();
      console.log("The error was: ", err);
      if (err instanceof HttpErrorResponse) {
        if (!offlineService.isOnline()) {
          return handleOfflineMode();
        }
        // if (isUnauthorized(err)) {
        //   return refreshToken(err);
        // }
        return returnError(err);
      }
      snackbarService.displayError();
      return EMPTY;
    }),
  );
};
