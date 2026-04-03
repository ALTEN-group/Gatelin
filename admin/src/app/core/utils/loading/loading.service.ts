import { Injectable, signal } from "@angular/core";

export type ProgressMode = "bar" | "spin";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  private readonly defaultMode: ProgressMode = "bar";
  private readonly _isLoading = signal(false);
  private readonly _mode = signal(this.defaultMode);

  public readonly isLoading = this._isLoading.asReadonly();
  public readonly mode = this._mode.asReadonly();

  public start(mode = this.defaultMode): void {
    this._mode.set(mode);
    this._isLoading.set(true);
  }

  public stop(): void {
    this._isLoading.set(false);
  }
}
