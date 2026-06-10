import { __decorate } from "tslib";
import { Injectable, signal } from "@angular/core";
let LocationInterceptorService = class LocationInterceptorService {
    constructor() {
        this._waitingForLocationHeader = signal(false);
        //Indicates if the interceptor is currently waiting for a location header
        this.waitingForLocationHeader = this._waitingForLocationHeader.asReadonly();
    }
    /**
     * Consume the location header stored in this service. This will clear the stored location.
     * It also clear the waiting flag
     * @returns The stored location header, or undefined if there is none.
     */
    consumeLocation() {
        this._waitingForLocationHeader.set(false);
        const location = this.locationHeader;
        this.locationHeader = undefined;
        return location;
    }
    /**
     * Indicates that the location interceptor should wait for a location header
     * to be received in the next response.
     */
    enableLocationHeaderWaiting() {
        this._waitingForLocationHeader.set(true);
    }
    /**
     * Store the location header intercepted by the location interceptor. This will clear
     * the waiting flag.
     * @param location The location header to store.
     */
    setLocation(location) {
        this.locationHeader = location;
        this._waitingForLocationHeader.set(false);
    }
};
LocationInterceptorService = __decorate([
    Injectable({ providedIn: "root" })
    /**
     * This class is used to store and consume a location intercepted by the location interceptor
     */
], LocationInterceptorService);
export { LocationInterceptorService };
//# sourceMappingURL=location-interceptor.service.js.map