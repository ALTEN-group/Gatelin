import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";

@Component({
  selector: "adm-home",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  imports: [ButtonModule, FormsModule, CardModule],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  public readonly areNotifsEnabled = inject(APP_CONFIG).env.msNotifEnabled;

  public readonly kpis = [
    {
      title: "Total Users",
      value: 1245,
      icon: "pi pi-users",
      severity: "info" as const,
      tooltip: "Number of registered users",
    },
    {
      title: "Active Sessions",
      value: 342,
      icon: "pi pi-clock",
      severity: "success" as const,
      tooltip: "Number of active sessions",
    },
    {
      title: "Pending Orders",
      value: 27,
      icon: "pi pi-shopping-cart",
      severity: "warn" as const,
      tooltip: "Number of orders pending fulfillment",
    },
  ];

  public readonly shortcuts = [
    {
      label: "Gestion des utilisateurs",
      icon: "pi pi-user-edit",
      route: "/accounts/users",
    },
    {
      label: "Démo formulaires",
      icon: "pi pi-file",
      route: "/form-demo",
    },
    {
      label: "Gestion des évènements",
      icon: "pi pi-chart-line",
      route: "/events",
    },
  ];

  public readonly actions = [
    {
      title: "Notifications en attente",
      value: 5,
      icon: "pi pi-bell",
      route: "/notifications",
      severity: "warn" as const,
    },
    {
      title: "Compléter le profil utilisateur",
      value: null,
      icon: "pi pi-user",
      route: "/user/profile",
      severity: "warn" as const,
    },
    {
      title: "Evènements non complets",
      value: 3,
      icon: "pi pi-exclamation-triangle",
      route: "/events",
      severity: "error" as const,
    },
  ];
}
