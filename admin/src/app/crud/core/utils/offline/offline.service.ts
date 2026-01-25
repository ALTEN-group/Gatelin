import { Injectable, Signal, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class OfflineService {
  private readonly _isOnline = signal(true);

  get isOnline(): Signal<boolean> {
    return this._isOnline.asReadonly();
  }

  constructor() {
    window.addEventListener("online", () => this.updateOnlineStatus());
    window.addEventListener("offline", () => this.updateOnlineStatus());
  }

  private updateOnlineStatus() {
    console.log("updateOnlineStatus", window.navigator.onLine);
    this._isOnline.set(window.navigator.onLine);
  }
}
