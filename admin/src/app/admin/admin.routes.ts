import { Routes } from "@angular/router";
import { ConsumersComponent } from "app/admin/features/consumers/consumers.component";
import { RoutesComponent } from "app/admin/features/routes/routes.component";

export const ADMIN_ROUTES: Routes = [
  {
    path: "routes",
    component: RoutesComponent,
    data: {
      breadcrumb: $localize`:@@Routes_routesNav:Routes`,
    },
  },
  {
    path: "consumers",
    component: ConsumersComponent,
    data: {
      breadcrumb: $localize`:@@Consumers_consumersNav:Consommateurs`,
    },
  },
  {
    path: "**",
    redirectTo: "routes",
    data: {},
  },
];
