import { Routes } from "@angular/router";
import { accessGuard } from "@core/acl/acl.guard";
import { NotFoundComponent } from "@core/pages/not-found/not-found.component";
import { operationsResolver } from "app/admin/data-access/operations/operations.resolver";
import { resourcesResolver } from "app/admin/data-access/resources/resources.resolver";
import { serviceResolver } from "app/admin/data-access/services/service.resolver";

/**
 * Application Paths
 */
export const AppPaths = {
  LOGIN: "login",
  ROUTES: "",
  CONSUMERS: "user",
  SERVICES: "maintenance",
  RESOURCES: "error",
  CORS: "cors",
  OPERATIONS: "operations",
  NOT_FOUND: "not-found",
} as const;

export const ROUTES: Routes = [
  {
    path: AppPaths.LOGIN,
    loadChildren: () =>
      import("./login/login.routes").then((m) => m.AUTH_ROUTES),
    title: "Connexion",
  },
  {
    path: AppPaths.ROUTES,
    loadComponent: () =>
      import("./admin/features/routes/routes.component").then(
        (m) => m.RoutesComponent,
      ),
    title: "Routes",
    canActivate: [accessGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_RoutesNav:Routes`,
    },
    resolve: {
      operations: operationsResolver,
      services: serviceResolver,
      resources: resourcesResolver,
    },
  },
  {
    path: AppPaths.CONSUMERS,
    loadComponent: () =>
      import("./admin/features/consumers/consumers.component").then(
        (m) => m.ConsumersComponent,
      ),
    title: "Consumers",
    canActivate: [accessGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_ConsumersNav:Consumers`,
    },
  },
  {
    path: AppPaths.SERVICES,
    loadComponent: () =>
      import("./admin/features/services/services.component").then(
        (m) => m.ServicesComponent,
      ),
    title: "Services",
    canActivate: [accessGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_ServicesNav:Services`,
    },
  },
  {
    path: AppPaths.RESOURCES,
    loadComponent: () =>
      import("./admin/features/resources/resources.component").then(
        (m) => m.ResourcesComponent,
      ),
    title: "Resources",
    canActivate: [accessGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_ResourcesNav:Resources`,
    },
    resolve: {
      services: serviceResolver,
    },
  },
  {
    path: AppPaths.CORS,
    loadComponent: () =>
      import("./admin/features/cors/cors.component").then(
        (m) => m.CorsComponent,
      ),
    title: "CORS",
    canActivate: [accessGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_CorsNav:CORS`,
    },
  },
  {
    path: AppPaths.OPERATIONS,
    loadComponent: () =>
      import("./admin/features/operations/operations.component").then(
        (m) => m.OperationsComponent,
      ),
    title: "Operations",
    canActivate: [accessGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_OperationsNav:Operations`,
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
    redirectTo: `/${AppPaths.ROUTES}`,
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: `/${AppPaths.NOT_FOUND}`,
    pathMatch: "full",
  },
];
