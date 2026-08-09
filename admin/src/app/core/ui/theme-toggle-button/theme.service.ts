import { effect, inject, Injectable, signal } from "@angular/core";
import { APP_CONFIG } from "@core/app-config/app-config.token";

export type AppTheme = "dark" | "light";

@Injectable({ providedIn: "root" })
export class ThemeService {
  private readonly storageKeys = inject(APP_CONFIG).storageKeys;

  private readonly _theme = signal<AppTheme>("light");
  public readonly theme = this._theme.asReadonly();

  readonly _setTheme = effect(() => {
    this.applyTheme(this._theme());
  });

  constructor() {
    this.init();
  }

  public toggleTheme() {
    this._theme.set(this._theme() === "dark" ? "light" : "dark");
  }

  private init() {
    const storedTheme = localStorage.getItem(this.storageKeys.THEME);
    const theme = this.validateTheme(storedTheme) ? storedTheme : "light";
    this._theme.set(theme);
  }

  private applyTheme(theme: AppTheme): void {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem(this.storageKeys.THEME, theme);
  }

  private validateTheme(theme: string | null): theme is AppTheme {
    return theme === "dark" || theme === "light";
  }
}
