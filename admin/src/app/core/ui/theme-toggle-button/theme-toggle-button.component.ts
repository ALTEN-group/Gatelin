import { Component, computed, inject } from "@angular/core";
import { ThemeService } from "@core/ui/theme-toggle-button/theme.service";

@Component({
  selector: "adm-theme-toggle-button",
  templateUrl: "./theme-toggle-button.component.html",
  styleUrls: ["./theme-toggle-button.component.scss"],
})
export class ThemeToggleButtonComponent {
  private readonly themeService = inject(ThemeService);

  public readonly isDarkMode = computed(
    () => this.themeService.theme() === "dark",
  );

  public toggleMode() {
    this.themeService.toggleTheme();
  }
}
