import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TableLoadingService {
  private readonly _isLoading = signal(false);
  public readonly isLoading = this._isLoading.asReadonly();

  public start(): void {
    this._isLoading.set(true);
  }

  public stop(): void {
    this._isLoading.set(false);
  }
}
