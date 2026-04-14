import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  ViewEncapsulation,
} from "@angular/core";
import { AclService } from "@core/acl/acl.service";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { AuthenticationService } from "@core/auth/auth.service";
import { ThemeToggleButtonComponent } from "@core/ui/theme-toggle-button/theme-toggle-button.component";
import { OfflineService } from "@dwtechs/crud-builder";
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
  private readonly offlineService = inject(OfflineService);
  private readonly aclService = inject(AclService);

  private readonly isOnline = this.offlineService.isOnline;

  public readonly themeToggled = output();

  public readonly areNotifsEnabled = inject(APP_CONFIG).env.msNotifEnabled;

  private readonly hasAccessToNotifications = computed(() => {
    return (
      this.areNotifsEnabled && this.aclService.hasAccess("notifications", "get")
    );
  });

  public readonly userMenuItems = computed<MenuItem[]>(() => [
    {
      label: "Profil utilisateur",
      icon: "pi pi-fw pi-cog",
      routerLink: "/user/profile",
    },
    {
      label: "Notifications",
      icon: "pi pi-fw pi-bell",
      routerLink: "/messages/notifications",
      visible: this.hasAccessToNotifications(),
    },
    {
      label: "Déconnexion",
      icon: "pi pi-fw pi-power-off",
      command: () => this.logout(),
    },
    {
      id: "status",
      label: this.isOnline() ? "En ligne" : "Hors ligne",
      icon: "pi pi-wifi",
      styleClass: this.isOnline() ? "online-status" : "offline-status",
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
