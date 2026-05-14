import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  ViewEncapsulation,
} from "@angular/core";
import { AuthenticationService } from "@core/auth/auth.service";
import { ThemeToggleButtonComponent } from "@core/ui/theme-toggle-button/theme-toggle-button.component";
import { MenuItem, SharedModule } from "primeng/api";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { MenuModule } from "primeng/menu";

@Component({
  selector: "adm-navbar",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  imports: [
    ThemeToggleButtonComponent,
    ButtonModule,
    BadgeModule,
    MenuModule,
    SharedModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {
  private readonly authenticationService = inject(AuthenticationService);

  public readonly themeToggled = output();

  public readonly userMenuItems = computed<MenuItem[]>(() => [
    {
      label: "Logout",
      icon: "pi pi-fw pi-power-off",
      command: () => this.logout(),
    },
  ]);

  public readonly portrait = computed(() => {
    const portrait = this.currentUser()?.portrait;
    return portrait ? `data:image/jpeg;base64, ${portrait}` : "";
  });

  public readonly isAuthenticated = this.authenticationService.isAuthenticated;
  public readonly currentUser = this.authenticationService.user;

  get userName(): string {
    if (this.isAuthenticated() && this.currentUser()) {
      const { firstName, lastName } = this.currentUser() ?? {};
      return lastName ? `${firstName} ${lastName}` : "";
    }
    return "";
  }

  public logout(): void {
    this.authenticationService.logout().subscribe();
  }
}
