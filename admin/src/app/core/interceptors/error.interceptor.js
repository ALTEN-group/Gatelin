import { HttpErrorResponse, } from "@angular/common/http";
import { effect, inject } from "@angular/core";
import { AuthenticationService } from "@core/auth/auth.service";
import { TokenService } from "@core/auth/token.service";
import { cloneReq } from "@core/interceptors/clone-req";
import { LoadingService } from "@core/utils/loading/loading.service";
import { SnackbarService } from "@core/utils/snackbar/snackbar.service";
import { OfflineService } from "@dwtechs/crud-builder";
import { bufferCount, catchError, EMPTY, forkJoin, switchMap, throwError, } from "rxjs";
export const errorInterceptor = (req, next) => {
    const snackbarService = inject(SnackbarService);
    const loadingService = inject(LoadingService);
    const offlineService = inject(OfflineService);
    const authenticationService = inject(AuthenticationService);
    const tokenService = inject(TokenService);
    let pendingRequests = [];
    effect(() => {
        if (offlineService.isOnline() && pendingRequests.length) {
            forkJoin(pendingRequests.map((r) => next(r)))
                .pipe(bufferCount(pendingRequests.length))
                .subscribe();
            pendingRequests = [];
        }
    });
    const formatErrorMessage = (err) => {
        const { statusText, message, url } = err;
        // keep only the path of the url after /api/
        const parsedUrl = url ? url.split("/api/")[1] : "";
        if (statusText && parsedUrl) {
            return `${statusText} (${parsedUrl})`;
        }
        return message;
    };
    const isNotFound = (err) => {
        return err.status === 404;
    };
    const isUnauthorized = (err) => {
        return err.status === 401;
    };
    const returnError = (err, withoutMessage = false) => {
        if (!withoutMessage) {
            snackbarService.displayError(formatErrorMessage(err));
        }
        return throwError(() => err);
    };
    const redirectToLogin = (err) => {
        authenticationService.redirectToLogin();
        return returnError(err);
    };
    const refreshToken = (err) => {
        const isRefreshTokenRequest = req.url.includes("sessions") && req.method === "PUT";
        if (isRefreshTokenRequest) {
            return redirectToLogin(err);
        }
        return authenticationService.refreshToken().pipe(catchError(() => redirectToLogin(err)), switchMap((res) => {
            const token = tokenService.getAccessToken();
            if (!res || !token) {
                return redirectToLogin(err);
            }
            // Assign new token and replay the request
            return next(cloneReq(req, token));
        }));
    };
    return next(req).pipe(catchError((err) => {
        loadingService.stop();
        console.log("The error was: ", err);
        if (err instanceof HttpErrorResponse) {
            if (isNotFound(err)) {
                return returnError(err, true);
            }
            if (isUnauthorized(err)) {
                return refreshToken(err);
            }
            return returnError(err);
        }
        snackbarService.displayError();
        return EMPTY;
    }));
};
//# sourceMappingURL=error.interceptor.js.map