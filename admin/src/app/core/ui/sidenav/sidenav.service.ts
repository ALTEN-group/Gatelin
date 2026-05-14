import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavigationEnd } from "@angular/router";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { MenuItem } from "primeng/api";
import { fromEvent, MonoTypeOperatorFunction, tap } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SidenavService {
  private readonly appConfig = inject(APP_CONFIG);
  public readonly baseSideNavItems: MenuItem[] = this.appConfig.sidenavItems;

  private readonly _expanded = signal(true);
  private readonly _pinned = signal(true);
  private readonly _isMobileDisplay = signal(false);

  private readonly _activeUrl = signal<string | null>(null);
  public readonly activeUrl = this._activeUrl.asReadonly();

  private readonly _alertKeys = signal<Set<string>>(new Set());
  public readonly alertKeys = this._alertKeys.asReadonly();

  private readonly resize$ = fromEvent(window, "resize").pipe(
    debounceTime(150),
    takeUntilDestroyed(),
  );

  constructor() {
    this.updateMobileState();

    this.resize$.subscribe(() => this.updateMobileState());
  }

  private updateMobileState(): void {
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;

    if (isMobile !== this._isMobileDisplay()) {
      this._isMobileDisplay.set(isMobile);
      if (isMobile) {
        this._pinned.set(false);
        this._expanded.set(false);
      } else {
        this._pinned.set(true);
        this._expanded.set(true);
      }
    }
  }

  public setActiveUrl(): MonoTypeOperatorFunction<NavigationEnd> {
    return tap((event) => this._activeUrl.set(event.url));
  }

  public addAlertKey(key: string) {
    this._alertKeys.update((keys) => {
      keys.add(key);
      return new Set(keys);
    });
  }

  public removeAlertKey(key: string) {
    this._alertKeys.update((keys) => {
      keys.delete(key);
      return new Set(keys);
    });
  }

  public readonly isExpanded = computed(
    () => this._expanded() || this._pinned(),
  );

  public getExpanded(): boolean {
    return this.isExpanded();
  }

  public getPinned(): boolean {
    return this._pinned();
  }

  public getMobileDisplay(): boolean {
    return this._isMobileDisplay();
  }

  public toggleExpanded(): void {
    this._expanded.update((val) => !val);
  }

  public setExpanded(expanded: boolean): void {
    this._expanded.set(expanded);
  }

  public togglePinned(): void {
    this._pinned.update((val) => !val);
  }
}
