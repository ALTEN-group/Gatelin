import { Routes } from "@angular/router";
import { accessGuard } from "@core/acl/acl.guard";
import { ErrorComponent } from "@core/pages/error/error.component";
import { MaintenanceComponent } from "@core/pages/maintenance/maintenance.component";
import { NotFoundComponent } from "@core/pages/not-found/not-found.component";

/**
 * Application Paths
 */
export const AppPaths = {
  LOGIN: "login",
  ADMIN: "",
  USER: "user",
  MAINTENANCE: "maintenance",
  ERROR: "error",
  NOT_FOUND: "not-found",
} as const;

export const ROUTES: Routes = [
  //   {
  //     path: AppPaths.HOME,
  //     component: HomeComponent,
  //     title: "Accueil",
  //   },
  {
    path: AppPaths.LOGIN,
    loadChildren: () =>
      import("./login/login.routes").then((m) => m.AUTH_ROUTES),
    title: "Connexion",
  },
  // Protected routes
  {
    path: "",
    canActivateChild: [accessGuard()],
    children: [
      {
        path: AppPaths.ADMIN,
        loadChildren: () =>
          import("./admin/admin.routes").then((m) => m.ADMIN_ROUTES),
        title: "Administration",
        data: {
          breadcrumb: $localize`:@@Admin_adminNav:Administration`,
        },
      },
      {
        path: AppPaths.MAINTENANCE,
        component: MaintenanceComponent,
        title: "Maintenance",
        data: {
          breadcrumb: $localize`:@@Maintenance_maintenanceNav:Maintenance`,
        },
      },
      {
        path: `${AppPaths.ERROR}/:code`,
        component: ErrorComponent,
        title: "Erreur",
        data: {
          breadcrumb: $localize`:@@Error_errorNav:Erreur`,
        },
      },
      {
        path: AppPaths.NOT_FOUND,
        component: NotFoundComponent,
        title: "Non trouvé",
        data: {
          breadcrumb: $localize`:@@NotFound_notFoundNav:Non trouvé`,
        },
      },
      {
        path: "",
        pathMatch: "full",
        redirectTo: `/${AppPaths.ADMIN}`,
      },
    ],
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: `/${AppPaths.ADMIN}`,
  },
  {
    path: "**",
    redirectTo: `/${AppPaths.NOT_FOUND}`,
    pathMatch: "full",
  },
];
