import { HttpResponse, } from "@angular/common/http";
import { inject } from "@angular/core";
import { SnackbarService } from "@core/utils/snackbar/snackbar.service";
import { tap } from "rxjs";
import { LocationInterceptorService } from "./location-interceptor.service";
/**
 * Http Interceptor that listens for "location" headers in the response.
 * If such a header is present and the interceptor is currently waiting for a location,
 * it will set this location in the LocationInterceptorService.
 * @param req The request to intercept.
 * @param next The next interceptor in the interceptor chain.
 * @returns An observable of the intercepted request.
 */
export const locationInterceptor = (req, next) => {
    const locationInterceptorService = inject(LocationInterceptorService);
    const snackbarService = inject(SnackbarService);
    return next(req).pipe(tap((res) => {
        //We ignore all events that are not HttpResponse
        if (!(res instanceof HttpResponse))
            return;
        const result = res;
        const shouldWaitForLocation = locationInterceptorService.waitingForLocationHeader();
        if (!shouldWaitForLocation)
            return;
        const headersHaveLocation = result.headers.has("location");
        if (!headersHaveLocation) {
            snackbarService.displayError("Export excel non disponible");
            return;
        }
        const location = result.headers.get("location");
        if (!location)
            return;
        locationInterceptorService.setLocation(location);
    }));
};
//# sourceMappingURL=location.interceptor.js.map